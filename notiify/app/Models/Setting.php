<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
        'description',
        'is_encrypted',
    ];

    /**
     * Получить значение настройки с автоматической расшифровкой
     */
    public function getValueAttribute($value)
    {
        if ($this->is_encrypted && !empty($value)) {
            try {
                return Crypt::decryptString($value);
            } catch (\Exception $e) {
                return $value;
            }
        }
        
        // Преобразуем значение в зависимости от типа
        switch ($this->type) {
            case 'boolean':
                return filter_var($value, FILTER_VALIDATE_BOOLEAN);
            case 'integer':
                return (int) $value;
            case 'json':
                return json_decode($value, true);
            default:
                return $value;
        }
    }

    /**
     * Установить значение настройки с автоматическим шифрованием
     */
    public function setValueAttribute($value)
    {
        if ($this->is_encrypted && !empty($value)) {
            $this->attributes['value'] = Crypt::encryptString($value);
        } else {
            // Преобразуем значение в зависимости от типа
            switch ($this->type) {
                case 'boolean':
                    $this->attributes['value'] = $value ? '1' : '0';
                    break;
                case 'integer':
                    $this->attributes['value'] = (string) $value;
                    break;
                case 'json':
                    $this->attributes['value'] = json_encode($value);
                    break;
                default:
                    $this->attributes['value'] = $value;
            }
        }
    }

    /**
     * Получить маскированное значение для отображения
     */
    public function getMaskedValue(): string
    {
        if (empty($this->value)) {
            return '';
        }

        // Для зашифрованных значений возвращаем маску
        if ($this->is_encrypted) {
            $value = $this->value;
            if (strlen($value) > 8) {
                return substr($value, 0, 4) . str_repeat('*', strlen($value) - 8) . substr($value, -4);
            }
            return str_repeat('*', strlen($value));
        }

        // Для обычных значений также маскируем чувствительные данные
        $sensitiveKeys = ['password', 'token', 'key', 'secret'];
        foreach ($sensitiveKeys as $sensitive) {
            if (stripos($this->key, $sensitive) !== false) {
                if (strlen($this->value) > 8) {
                    return substr($this->value, 0, 4) . str_repeat('*', strlen($this->value) - 8) . substr($this->value, -4);
                }
                return str_repeat('*', strlen($this->value));
            }
        }

        return $this->value;
    }

    /**
     * Получить настройку по ключу
     * Если значение - ссылка на .env ({{ENV:KEY}}), возвращаем значение из .env
     */
    public static function get(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }

        $value = $setting->value;

        // Проверяем, является ли значение ссылкой на .env
        if (preg_match('/^{{ENV:([^}]+)}}$/', $value, $matches)) {
            $envKey = $matches[1];
            // Получаем значение из .env
            $envValue = env($envKey);
            return $envValue !== null ? $envValue : $default;
        }

        return $value;
    }

    /**
     * Установить настройку
     */
    public static function set(string $key, $value, string $group = 'general', string $type = 'string', bool $encrypted = false): void
    {
        static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'group' => $group,
                'type' => $type,
                'is_encrypted' => $encrypted,
            ]
        );
    }

    /**
     * Получить все настройки группы
     */
    public static function getGroup(string $group): array
    {
        return static::where('group', $group)
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => $setting->value];
            })
            ->toArray();
    }
}

