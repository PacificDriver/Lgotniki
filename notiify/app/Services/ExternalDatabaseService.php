<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;

/**
 * Сервис для работы с внешней базой данных сайта (PostgreSQL)
 * Загрузка пассажиров по ID рейса из таблицы билетов
 */
class ExternalDatabaseService
{
    protected ?string $connectionName = null;
    protected array $connectionConfig = [];

    public function __construct()
    {
        // Получаем настройки подключения из настроек или .env
        $this->loadConnectionConfig();
    }

    /**
     * Загрузить настройки подключения из настроек
     */
    protected function loadConnectionConfig(): void
    {
        // Получаем из настроек (Settings модель)
        $dbHost = \App\Models\Setting::get('database_host', env('EXTERNAL_DB_HOST'));
        $dbPort = \App\Models\Setting::get('database_port', env('EXTERNAL_DB_PORT', 5432));
        $dbDatabase = \App\Models\Setting::get('database_database', env('EXTERNAL_DB_DATABASE'));
        $dbUsername = \App\Models\Setting::get('database_username', env('EXTERNAL_DB_USERNAME'));
        $dbPassword = \App\Models\Setting::get('database_password', env('EXTERNAL_DB_PASSWORD'));

        // Если настройки не заданы, используем значения по умолчанию из .env
        if (empty($dbHost) || empty($dbDatabase)) {
            $dbHost = env('EXTERNAL_DB_HOST');
            $dbPort = env('EXTERNAL_DB_PORT', 5432);
            $dbDatabase = env('EXTERNAL_DB_DATABASE');
            $dbUsername = env('EXTERNAL_DB_USERNAME');
            $dbPassword = env('EXTERNAL_DB_PASSWORD');
        }

        $this->connectionConfig = [
            'driver' => 'pgsql',
            'host' => $dbHost,
            'port' => $dbPort,
            'database' => $dbDatabase,
            'username' => $dbUsername,
            'password' => $dbPassword,
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => 'prefer',
        ];

        // Создаем временное подключение
        $this->connectionName = 'external_db_' . uniqid();
        Config::set("database.connections.{$this->connectionName}", $this->connectionConfig);
    }

    /**
     * Получить пассажиров для рейса по ID рейса из таблицы билетов
     * 
     * @param string $raceId ID рейса из API перевозчика
     * @return array Массив пассажиров
     */
    public function getPassengersByRaceId(string $raceId): array
    {
        try {
            // Определяем имя таблицы (может быть tickets, bookings, passenger_tickets и т.д.)
            $tableName = \App\Models\Setting::get('database_tickets_table', env('EXTERNAL_DB_TICKETS_TABLE', 'tickets'));
            
            // Определяем имя колонки с ID рейса (может быть race_id, trip_id, route_id и т.д.)
            $raceIdColumn = \App\Models\Setting::get('database_race_id_column', env('EXTERNAL_DB_RACE_ID_COLUMN', 'race_id'));

            // Определяем колонки для получения данных пассажира
            $emailColumn = \App\Models\Setting::get('database_email_column', env('EXTERNAL_DB_EMAIL_COLUMN', 'email'));
            $phoneColumn = \App\Models\Setting::get('database_phone_column', env('EXTERNAL_DB_PHONE_COLUMN', 'phone'));
            $firstNameColumn = \App\Models\Setting::get('database_first_name_column', env('EXTERNAL_DB_FIRST_NAME_COLUMN', 'first_name'));
            $lastNameColumn = \App\Models\Setting::get('database_last_name_column', env('EXTERNAL_DB_LAST_NAME_COLUMN', 'last_name'));
            $middleNameColumn = \App\Models\Setting::get('database_middle_name_column', env('EXTERNAL_DB_MIDDLE_NAME_COLUMN', 'middle_name'));

            // Выполняем запрос к внешней БД
            $passengers = DB::connection($this->connectionName)
                ->table($tableName)
                ->where($raceIdColumn, $raceId)
                ->select([
                    $emailColumn,
                    $phoneColumn,
                    $firstNameColumn,
                    $lastNameColumn,
                    $middleNameColumn,
                ])
                ->get()
                ->map(function ($passenger) use ($emailColumn, $phoneColumn, $firstNameColumn, $lastNameColumn, $middleNameColumn) {
                    return [
                        'email' => $passenger->{$emailColumn} ?? null,
                        'phone' => $passenger->{$phoneColumn} ?? null,
                        'first_name' => $passenger->{$firstNameColumn} ?? '',
                        'last_name' => $passenger->{$lastNameColumn} ?? '',
                        'middle_name' => $passenger->{$middleNameColumn} ?? null,
                    ];
                })
                ->toArray();

            Log::info("Loaded passengers from external database", [
                'race_id' => $raceId,
                'count' => count($passengers),
            ]);

            return $passengers;

        } catch (\Exception $e) {
            Log::error("Failed to load passengers from external database", [
                'race_id' => $raceId,
                'error' => $e->getMessage(),
            ]);

            throw new \Exception("Ошибка при загрузке пассажиров из БД: " . $e->getMessage());
        }
    }

    /**
     * Проверить подключение к внешней БД
     */
    public function checkConnection(): bool
    {
        try {
            DB::connection($this->connectionName)->getPdo();
            return true;
        } catch (\Exception $e) {
            Log::warning("External database connection check failed", [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Получить список всех пассажиров для нескольких рейсов
     * 
     * @param array $raceIds Массив ID рейсов
     * @return array Массив пассажиров с указанием race_id
     */
    public function getPassengersByRaceIds(array $raceIds): array
    {
        $allPassengers = [];

        foreach ($raceIds as $raceId) {
            try {
                $passengers = $this->getPassengersByRaceId($raceId);
                foreach ($passengers as $passenger) {
                    $passenger['race_id'] = $raceId;
                    $allPassengers[] = $passenger;
                }
            } catch (\Exception $e) {
                Log::warning("Failed to load passengers for race", [
                    'race_id' => $raceId,
                    'error' => $e->getMessage(),
                ]);
                // Продолжаем загрузку для других рейсов
            }
        }

        return $allPassengers;
    }
}

