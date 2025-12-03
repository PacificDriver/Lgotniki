<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    */

    'whatsapp' => [
        'api_url' => env('WHATSAPP_API_URL'),
        'api_token' => env('WHATSAPP_API_TOKEN'),
        'from_number' => env('WHATSAPP_FROM_NUMBER'),
        'daily_limit' => env('WHATSAPP_DAILY_LIMIT', 1000),
        'rate_limit_per_second' => env('WHATSAPP_RATE_LIMIT_PER_SECOND', 20), // Rate limiting для WhatsApp API
    ],

    'carrier_api' => [
        'url' => env('CARRIER_API_URL', 'http://rc.rfbus.ru:8086'),
        'key' => env('CARRIER_API_KEY'), // x-access-token для API Сахалинского перевозчика
        'timeout' => env('CARRIER_API_TIMEOUT', 30),
    ],

    'notification' => [
        'batch_size' => env('NOTIFICATION_BATCH_SIZE', 15), // 10-20 сообщений в batch
        'delay_seconds' => env('NOTIFICATION_DELAY_SECONDS', 2),
    ],

];


