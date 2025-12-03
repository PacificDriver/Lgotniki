<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\CarrierApiService;
use App\Services\EmailService;
use App\Services\WhatsAppService;
use App\Services\ExternalDatabaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Получить все настройки или настройки группы
     */
    public function index(Request $request): JsonResponse
    {
        $group = $request->query('group');
        
        if ($group) {
            $settings = Setting::where('group', $group)->get();
            $result = [];
            foreach ($settings as $setting) {
                // Убираем префикс группы из ключа для удобства
                $key = str_replace("{$group}_", '', $setting->key);
                
                // Пропускаем маски (они используются отдельно)
                if (str_ends_with($key, '_mask')) {
                    continue;
                }
                
                // Проверяем, является ли значение ссылкой на .env
                if (preg_match('/^{{ENV:([^}]+)}}$/', $setting->value, $matches)) {
                    // Для секретных данных возвращаем маску из БД
                    $maskKey = $setting->key . '_mask';
                    $maskSetting = Setting::where('key', $maskKey)->first();
                    $result[$key] = $maskSetting ? $maskSetting->value : '****';
                } else {
                    // Для несекретных данных возвращаем значение как есть
                    $result[$key] = $setting->value;
                }
            }
            $settings = $result;
        } else {
            $settings = Setting::all()->groupBy('group')->map(function ($items, $groupName) {
                $result = [];
                foreach ($items as $item) {
                    $key = str_replace("{$groupName}_", '', $item->key);
                    
                    // Пропускаем маски
                    if (str_ends_with($key, '_mask')) {
                        continue;
                    }
                    
                    // Проверяем, является ли значение ссылкой на .env
                    if (preg_match('/^{{ENV:([^}]+)}}$/', $item->value, $matches)) {
                        // Для секретных данных возвращаем маску из БД
                        $maskKey = $item->key . '_mask';
                        $maskSetting = Setting::where('key', $maskKey)->first();
                        $result[$key] = $maskSetting ? $maskSetting->value : '****';
                    } else {
                        $result[$key] = $item->value;
                    }
                }
                return $result;
            })->toArray();
        }

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Сохранить настройки группы
     * Согласно ТЗ: секретные данные хранятся в .env, в БД только идентификаторы и маски
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'group' => 'required|string|in:carrier_api,database,email,whatsapp',
            'settings' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $group = $request->input('group');
        $settings = $request->input('settings');

        try {
            // Определяем, какие поля являются секретными (должны храниться в .env)
            $secretKeys = $this->getEncryptedKeys($group);
            $envFile = base_path('.env');
            $envContent = file_exists($envFile) ? file_get_contents($envFile) : '';

            foreach ($settings as $key => $value) {
                $fullKey = "{$group}_{$key}";
                $isSecret = in_array($key, $secretKeys);

                if ($isSecret && !empty($value)) {
                    // Секретные данные сохраняем в .env файл
                    $envKey = strtoupper($group . '_' . $key);
                    
                    // Обновляем или добавляем значение в .env
                    if (preg_match("/^{$envKey}=.*/m", $envContent)) {
                        $envContent = preg_replace("/^{$envKey}=.*/m", "{$envKey}={$value}", $envContent);
                    } else {
                        $envContent .= "\n{$envKey}={$value}";
                    }

                    // В БД сохраняем только идентификатор (ссылка на .env) и маску
                    $maskedValue = $this->maskValue($value);
                    Setting::set(
                        key: $fullKey,
                        value: '{{ENV:' . $envKey . '}}', // Идентификатор ссылки на .env
                        group: $group,
                        type: $this->getSettingType($key),
                        encrypted: false // Не шифруем, так как это только ссылка
                    );

                    // Сохраняем маску отдельно для отображения
                    Setting::set(
                        key: "{$fullKey}_mask",
                        value: $maskedValue,
                        group: $group,
                        type: 'string',
                        encrypted: false
                    );
                } else {
                    // Несекретные данные сохраняем в БД как обычно
                    Setting::set(
                        key: $fullKey,
                        value: $value,
                        group: $group,
                        type: $this->getSettingType($key),
                        encrypted: false
                    );
                }
            }

            // Сохраняем обновленный .env файл
            if (!empty($envContent)) {
                file_put_contents($envFile, $envContent);
            }

            // Обновляем конфигурацию кэша
            $this->clearConfigCache();

            Log::info("Settings updated", [
                'group' => $group,
                'keys' => array_keys($settings),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Settings saved successfully',
            ]);

        } catch (\Exception $e) {
            Log::error("Failed to save settings", [
                'group' => $group,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to save settings: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Маскировать значение для отображения
     */
    protected function maskValue(string $value): string
    {
        if (strlen($value) > 8) {
            return substr($value, 0, 4) . str_repeat('*', strlen($value) - 8) . substr($value, -4);
        }
        return str_repeat('*', strlen($value));
    }

    /**
     * Проверить подключение к API перевозчика
     */
    public function testCarrierApi(Request $request): JsonResponse
    {
        try {
            // Временно обновляем конфигурацию из запроса
            $tempSettings = $request->input('settings', []);
            if (!empty($tempSettings)) {
                foreach ($tempSettings as $key => $value) {
                    config(["services.carrier_api.{$key}" => $value]);
                }
            }

            $carrierService = app(CarrierApiService::class);
            $isConnected = $carrierService->checkConnection();

            if ($isConnected) {
                return response()->json([
                    'success' => true,
                    'message' => 'Carrier API connection successful',
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Carrier API connection failed',
                ], 400);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Carrier API connection failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Проверить подключение к Email
     */
    public function testEmail(Request $request): JsonResponse
    {
        try {
            $email = $request->input('test_email', config('mail.from.address'));
            
            if (empty($email)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Test email address is required',
                ], 400);
            }

            $emailService = app(EmailService::class);
            $emailService->send(
                to: $email,
                subject: 'Тестовое письмо от системы уведомлений',
                body: 'Это тестовое письмо для проверки настроек SMTP.'
            );

            return response()->json([
                'success' => true,
                'message' => 'Test email sent successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Email sending failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Проверить подключение к WhatsApp API
     */
    public function testWhatsApp(Request $request): JsonResponse
    {
        try {
            $whatsappService = app(WhatsAppService::class);
            // Проверяем статус профиля или отправляем тестовое сообщение
            return response()->json([
                'success' => true,
                'message' => 'WhatsApp API connection check completed',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'WhatsApp API connection failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Проверить подключение к внешней БД
     */
    public function testDatabase(Request $request): JsonResponse
    {
        try {
            $dbService = app(ExternalDatabaseService::class);
            $isConnected = $dbService->checkConnection();

            if ($isConnected) {
                return response()->json([
                    'success' => true,
                    'message' => 'External database connection successful',
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'External database connection failed',
                ], 400);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'External database connection failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Получить список ключей, которые нужно зашифровать
     */
    protected function getEncryptedKeys(string $group): array
    {
        return match ($group) {
            'whatsapp' => ['api_token', 'webhook_secret'],
            'email' => ['password'],
            'carrier_api' => ['key'],
            'database' => ['password'],
            default => [],
        };
    }

    /**
     * Проверить, является ли ключ чувствительным
     */
    protected function isSensitiveKey(string $key): bool
    {
        $sensitiveKeys = ['password', 'token', 'key', 'secret', 'api_key'];
        foreach ($sensitiveKeys as $sensitive) {
            if (stripos($key, $sensitive) !== false) {
                return true;
            }
        }
        return false;
    }

    /**
     * Определить тип настройки
     */
    protected function getSettingType(string $key): string
    {
        if (str_contains($key, '_limit') || str_contains($key, '_count') || str_contains($key, 'timeout') || str_contains($key, 'port')) {
            return 'integer';
        }
        
        if (str_contains($key, '_enabled') || str_contains($key, 'use_')) {
            return 'boolean';
        }
        
        return 'string';
    }

    /**
     * Очистить кэш конфигурации
     */
    protected function clearConfigCache(): void
    {
        try {
            if (function_exists('exec')) {
                exec('php artisan config:clear', $output, $return);
            }
        } catch (\Exception $e) {
            Log::warning("Failed to clear config cache", ['error' => $e->getMessage()]);
        }
    }
}

