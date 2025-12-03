<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Station;
use App\Models\Route;
use App\Models\Trip;
use App\Models\Passenger;
use App\Models\MessageTemplate;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Создаем пользователей
        $admin = User::create([
            'name' => 'Администратор',
            'email' => 'admin@busnotifications.ru',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $operator = User::create([
            'name' => 'Оператор Иван',
            'email' => 'operator@busnotifications.ru',
            'password' => Hash::make('password'),
            'role' => 'operator',
            'is_active' => true,
        ]);

        // Создаем станции
        $smirnykh = Station::create([
            'name' => 'Смирных',
            'code' => 'SMR',
            'city' => 'Смирных',
            'region' => 'Сахалинская область',
            'latitude' => 49.7739,
            'longitude' => 142.8442,
            'is_active' => true,
        ]);

        $yuzhno = Station::create([
            'name' => 'Южно-Сахалинск',
            'code' => 'YSK',
            'city' => 'Южно-Сахалинск',
            'region' => 'Сахалинская область',
            'latitude' => 46.9590,
            'longitude' => 142.7386,
            'is_active' => true,
        ]);

        $korsakov = Station::create([
            'name' => 'Корсаков',
            'code' => 'KRS',
            'city' => 'Корсаков',
            'region' => 'Сахалинская область',
            'latitude' => 46.6348,
            'longitude' => 142.7739,
            'is_active' => true,
        ]);

        // Создаем маршруты
        $route1 = Route::create([
            'departure_station_id' => $smirnykh->id,
            'arrival_station_id' => $yuzhno->id,
            'route_number' => '101',
            'duration_minutes' => 180,
            'distance_km' => 200,
            'is_active' => true,
        ]);

        $route2 = Route::create([
            'departure_station_id' => $yuzhno->id,
            'arrival_station_id' => $korsakov->id,
            'route_number' => '102',
            'duration_minutes' => 60,
            'distance_km' => 50,
            'is_active' => true,
        ]);

        // Создаем рейсы (включая отмененные)
        $cancelledTrip = Trip::create([
            'route_id' => $route1->id,
            'trip_number' => '507',
            'external_id' => 'EXT-507-001',
            'departure_time' => now()->addDays(1)->setTime(10, 30),
            'arrival_time' => now()->addDays(1)->setTime(13, 30),
            'status' => 'cancelled',
            'cancellation_reason' => 'Технические неисправности автобуса',
            'cancelled_at' => now(),
            'total_seats' => 45,
            'available_seats' => 30,
        ]);

        $scheduledTrip = Trip::create([
            'route_id' => $route1->id,
            'trip_number' => '508',
            'external_id' => 'EXT-508-001',
            'departure_time' => now()->addDays(2)->setTime(14, 0),
            'arrival_time' => now()->addDays(2)->setTime(17, 0),
            'status' => 'scheduled',
            'total_seats' => 45,
            'available_seats' => 22,
        ]);

        // Создаем пассажиров для отмененного рейса
        $passengers = [
            [
                'first_name' => 'Иван',
                'last_name' => 'Иванов',
                'middle_name' => 'Иванович',
                'email' => 'ivanov@example.com',
                'phone' => '+79001234567',
            ],
            [
                'first_name' => 'Петр',
                'last_name' => 'Петров',
                'middle_name' => 'Петрович',
                'email' => 'petrov@example.com',
                'phone' => '+79001234568',
            ],
            [
                'first_name' => 'Мария',
                'last_name' => 'Сидорова',
                'middle_name' => 'Александровна',
                'email' => 'sidorova@example.com',
                'phone' => '+79001234569',
            ],
            [
                'first_name' => 'Анна',
                'last_name' => 'Козлова',
                'middle_name' => 'Сергеевна',
                'email' => 'kozlova@example.com',
                'phone' => '+79001234570',
            ],
            [
                'first_name' => 'Алексей',
                'last_name' => 'Смирнов',
                'middle_name' => 'Викторович',
                'email' => 'smirnov@example.com',
                'phone' => '+79001234571',
            ],
        ];

        foreach ($passengers as $index => $passengerData) {
            Passenger::create([
                'trip_id' => $cancelledTrip->id,
                'external_booking_id' => 'BOOK-' . str_pad($index + 1, 5, '0', STR_PAD_LEFT),
                'first_name' => $passengerData['first_name'],
                'last_name' => $passengerData['last_name'],
                'middle_name' => $passengerData['middle_name'],
                'email' => $passengerData['email'],
                'phone' => $passengerData['phone'],
                'seat_number' => (string)($index + 1),
                'ticket_price' => 1500.00,
                'ticket_status' => 'paid',
            ]);
        }

        // Создаем шаблоны сообщений
        MessageTemplate::create([
            'name' => 'Уведомление об отмене рейса',
            'slug' => 'cancellation-notification',
            'type' => 'cancellation',
            'subject' => 'Отмена рейса №{{trip_number}}',
            'body' => "Уважаемый(ая) {{passenger_full_name}},\n\nСообщаем, что рейс №{{trip_number}} по маршруту {{departure_station}} → {{arrival_station}}, запланированный на {{departure_time}}, был отменен.\n\nПричина: {{cancellation_reason}}\n\nДеньги за билет будут возвращены в течение 5 рабочих дней.\n\nПриносим извинения за неудобства.\n\nС уважением,\nАвтобусная компания",
            'available_variables' => [
                'passenger_full_name',
                'passenger_first_name',
                'trip_number',
                'departure_station',
                'arrival_station',
                'departure_time',
                'cancellation_reason',
            ],
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        MessageTemplate::create([
            'name' => 'Уведомление о задержке рейса',
            'slug' => 'delay-notification',
            'type' => 'delay',
            'subject' => 'Задержка рейса №{{trip_number}}',
            'body' => "Уважаемый(ая) {{passenger_full_name}},\n\nСообщаем, что рейс №{{trip_number}} по маршруту {{departure_station}} → {{arrival_station}} задерживается на {{delay_minutes}} минут.\n\nНовое время отправления: {{departure_time}}\n\nПриносим извинения за неудобства.\n\nС уважением,\nАвтобусная компания",
            'available_variables' => [
                'passenger_full_name',
                'trip_number',
                'departure_station',
                'arrival_station',
                'departure_time',
                'delay_minutes',
            ],
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        MessageTemplate::create([
            'name' => 'Общее уведомление',
            'slug' => 'general-notification',
            'type' => 'general',
            'subject' => 'Важное сообщение о рейсе №{{trip_number}}',
            'body' => "Уважаемый(ая) {{passenger_full_name}},\n\nВаш рейс №{{trip_number}} {{departure_station}} → {{arrival_station}} на {{departure_time}}.\n\nС уважением,\nАвтобусная компания",
            'available_variables' => [
                'passenger_full_name',
                'trip_number',
                'departure_station',
                'arrival_station',
                'departure_time',
            ],
            'is_active' => true,
            'created_by' => $admin->id,
        ]);

        $this->command->info('✅ База данных заполнена тестовыми данными!');
        $this->command->info('');
        $this->command->info('👤 Учетные данные:');
        $this->command->info('   Администратор: admin@busnotifications.ru / password');
        $this->command->info('   Оператор: operator@busnotifications.ru / password');
        $this->command->info('');
        $this->command->info('📊 Создано:');
        $this->command->info('   - 2 пользователя (1 админ, 1 оператор)');
        $this->command->info('   - 3 станции');
        $this->command->info('   - 2 маршрута');
        $this->command->info('   - 2 рейса (1 отмененный)');
        $this->command->info('   - 5 пассажиров');
        $this->command->info('   - 3 шаблона сообщений');
    }
}




