<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotificationTask;
use App\Models\Notification;
use App\Models\MessageTemplate;
use App\Services\ExternalDatabaseService;
use App\Jobs\SendNotificationJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationTaskController extends Controller
{
    protected ExternalDatabaseService $externalDbService;

    public function __construct(ExternalDatabaseService $externalDbService)
    {
        $this->externalDbService = $externalDbService;
    }

    /**
     * Получить список задач на рассылку
     */
    public function index(Request $request): JsonResponse
    {
        $tasks = NotificationTask::with(['operator', 'templateRelation'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $tasks,
        ]);
    }

    /**
     * Загрузить список пассажиров для выбранных рейсов
     * После привязки рейсов к задаче, оператор нажимает «Загрузить список пассажиров»
     */
    public function loadPassengers(Request $request, int $id): JsonResponse
    {
        $task = NotificationTask::findOrFail($id);

        try {
            // Получаем ID рейсов из races_data
            $raceIds = $task->getRaceIds();
            if (empty($raceIds)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No race IDs found in task',
                ], 400);
            }

            // Загружаем пассажиров из внешней БД
            $allPassengers = $this->externalDbService->getPassengersByRaceIds($raceIds);

            // Группируем по рейсам и добавляем информацию о рейсе
            $racesData = $task->getRacesData();
            $racesById = [];
            foreach ($racesData as $race) {
                $racesById[$race['id']] = $race;
            }

            $passengersByRace = [];
            foreach ($allPassengers as $passengerData) {
                $raceId = $passengerData['race_id'] ?? null;
                $race = $racesById[$raceId] ?? null;

                if (!$race) {
                    continue;
                }

                // Добавляем информацию о рейсе к пассажиру
                $passengerData['race_info'] = [
                    'id' => $race['id'] ?? null,
                    'route' => $race['route'] ?? null,
                    'dt_depart' => $race['dt_depart'] ?? null,
                    'route_start' => $race['route_start'] ?? null,
                    'route_end' => $race['route_end'] ?? null,
                ];

                if (!isset($passengersByRace[$raceId])) {
                    $passengersByRace[$raceId] = [];
                }
                $passengersByRace[$raceId][] = $passengerData;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'passengers' => $allPassengers,
                    'passengers_by_race' => $passengersByRace,
                    'total_count' => count($allPassengers),
                    'valid_count' => count(array_filter($allPassengers, function ($p) {
                        return !empty($p['email']) || !empty($p['phone']);
                    })),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load passengers: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Создать новую задачу на рассылку
     * Принимает races_data - массив данных отмененных рейсов из API
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'races_data' => 'required|array|min:1', // Массив данных рейсов из API
            'races_data.*.id' => 'required|string', // ID рейса обязателен
            'template' => 'nullable|string', // Текст шаблона сообщения
            'template_id' => 'nullable|exists:message_templates,id',
            'custom_message' => 'nullable|string',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        try {
            // Извлекаем ID рейсов для подсчета пассажиров
            $raceIds = array_map(function ($race) {
                return $race['id'] ?? null;
            }, $validated['races_data']);
            $raceIds = array_filter($raceIds);

            // Подсчитываем количество пассажиров из внешней БД
            $passengers = $this->externalDbService->getPassengersByRaceIds($raceIds);
            $totalRecipients = count(array_filter($passengers, function ($p) {
                return !empty($p['email']) || !empty($p['phone']);
            }));

            $task = NotificationTask::create([
                'title' => $validated['title'],
                'operator_id' => $request->user()->id,
                'races_data' => $validated['races_data'],
                'template' => $validated['template'] ?? $validated['custom_message'] ?? null,
                'template_id' => $validated['template_id'] ?? null,
                'custom_message' => $validated['custom_message'] ?? null,
                'total_recipients' => $totalRecipients,
                'status' => 'draft',
                'scheduled_at' => $validated['scheduled_at'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'data' => $task,
                'message' => 'Notification task created successfully',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create task: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Получить информацию о задаче
     */
    public function show(int $id): JsonResponse
    {
        $task = NotificationTask::with([
            'operator',
            'templateRelation',
            'notifications',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $task,
        ]);
    }

    /**
     * Запустить отправку уведомлений
     * Загружает пассажиров из внешней БД по race ID из races_data
     */
    public function send(Request $request, int $id): JsonResponse
    {
        $task = NotificationTask::findOrFail($id);

        if ($task->status !== 'draft' && $task->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Task cannot be sent. Current status: ' . $task->status,
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Получаем ID рейсов из races_data
            $raceIds = $task->getRaceIds();
            if (empty($raceIds)) {
                throw new \Exception('No race IDs found in task data');
            }

            // Загружаем пассажиров из внешней БД
            $allPassengers = $this->externalDbService->getPassengersByRaceIds($raceIds);

            // Получаем данные рейсов для подстановки переменных
            $racesData = $task->getRacesData();
            $racesById = [];
            foreach ($racesData as $race) {
                $racesById[$race['id']] = $race;
            }

            // Определяем текст сообщения
            $messageTemplate = $task->template ?? $task->custom_message;
            $templateModel = $task->templateRelation;
            
            // Если есть template_id, используем шаблон
            if ($templateModel) {
                // Используем тело шаблона
                $messageTemplate = $templateModel->body;
            }

            $notificationCount = 0;

            // Batch обработка: создаем уведомления порциями по 10-20
            $batchSize = config('services.notification.batch_size', 15);
            $notifications = [];
            $batchDelay = 0;

            foreach ($allPassengers as $passengerData) {
                $raceId = $passengerData['race_id'] ?? null;
                $race = $racesById[$raceId] ?? null;

                if (!$race) {
                    continue;
                }

                // Формируем сообщение с подстановкой переменных
                $message = $this->renderMessage($messageTemplate, $race, $passengerData, $templateModel);

                // Email уведомление
                if (!empty($passengerData['email'])) {
                    $notification = Notification::create([
                        'notification_task_id' => $task->id,
                        'channel' => 'email',
                        'recipient' => $passengerData['email'],
                        'subject' => 'Уведомление об отмене рейса',
                        'message' => $message,
                        'status' => 'pending',
                    ]);

                    $notifications[] = $notification;
                    $notificationCount++;
                }

                // WhatsApp уведомление
                if (!empty($passengerData['phone'])) {
                    $notification = Notification::create([
                        'notification_task_id' => $task->id,
                        'channel' => 'whatsapp',
                        'recipient' => $passengerData['phone'],
                        'subject' => null,
                        'message' => $message,
                        'status' => 'pending',
                    ]);

                    $notifications[] = $notification;
                    $notificationCount++;
                }

                // Отправляем batch когда накопилось нужное количество
                if (count($notifications) >= $batchSize) {
                    $this->dispatchBatch($notifications, $batchDelay);
                    $notifications = [];
                    $batchDelay += 2; // Задержка между батчами
                }
            }

            // Отправляем оставшиеся уведомления
            if (!empty($notifications)) {
                $this->dispatchBatch($notifications, $batchDelay);
            }

            $task->update([
                'status' => 'processing',
                'started_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Notifications queued successfully',
                'total_recipients' => count($allPassengers),
                'total_notifications' => $notificationCount,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to queue notifications: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Рендерить сообщение с подстановкой переменных
     * Поддерживает переменные: {РЕЙС}, {ДАТА}, {ВРЕМЯ}
     * Пример: ❌ Рейс отменен. Ваш рейс {31.10.25} отправление в {12:00} по маршруту {№ 510 Южно-Сахалинск-Макаров} отменен.
     */
    protected function renderMessage(?string $template, array $race, array $passenger, $templateModel = null): string
    {
        if (!$template) {
            return 'Ваш рейс отменен.';
        }

        // Форматируем дату и время из рейса
        $departureDate = null;
        $departureTime = null;
        $routeName = '';

        if (isset($race['dt_depart'])) {
            try {
                $dt = \Carbon\Carbon::parse($race['dt_depart']);
                // Формат даты как в примере: 31.10.25 (DD.MM.YY)
                $departureDate = $dt->format('d.m.y');
                $departureTime = $dt->format('H:i');
            } catch (\Exception $e) {
                // Игнорируем ошибки парсинга
            }
        }

        // Формируем название маршрута из данных рейса
        // Пример: № 510 Южно-Сахалинск-Макаров
        if (isset($race['route']) && isset($race['route_start']) && isset($race['route_end'])) {
            $routeName = '№ ' . $race['route'] . ' ' . $race['route_start'] . '-' . $race['route_end'];
        } elseif (isset($race['route'])) {
            $routeName = '№ ' . $race['route'];
        } elseif (isset($race['id'])) {
            $routeName = 'рейс ' . $race['id'];
        } else {
            $routeName = 'рейс';
        }

        // Заменяем переменные {РЕЙС}, {ДАТА}, {ВРЕМЯ}
        $message = $template;
        $message = str_replace('{РЕЙС}', $routeName, $message);
        $message = str_replace('{ДАТА}', $departureDate ?: 'дата', $message);
        $message = str_replace('{ВРЕМЯ}', $departureTime ?: 'время', $message);
        
        // Также поддерживаем формат {{variable}} для обратной совместимости
        $message = str_replace('{{РЕЙС}}', $routeName, $message);
        $message = str_replace('{{ДАТА}}', $departureDate ?: 'дата', $message);
        $message = str_replace('{{ВРЕМЯ}}', $departureTime ?: 'время', $message);

        return $message;
    }

    /**
     * Отправить batch уведомлений в очередь
     */
    protected function dispatchBatch(array $notifications, int $delay = 0): void
    {
        foreach ($notifications as $index => $notification) {
            // Добавляем в очередь с небольшой задержкой внутри батча
            SendNotificationJob::dispatch($notification)
                ->delay(now()->addSeconds($delay + ($index * 0.1)));
        }
    }

    /**
     * Получить статус отправки задачи
     */
    public function getStatus(int $id): JsonResponse
    {
        $task = NotificationTask::with(['notifications' => function ($query) {
            $query->select('notification_task_id', 'status', 'channel', DB::raw('count(*) as count'))
                  ->groupBy('notification_task_id', 'status', 'channel');
        }])->findOrFail($id);

        $stats = [
            'total' => $task->total_recipients,
            'sent' => $task->sent_count,
            'failed' => $task->failed_count,
            'pending' => $task->notifications()->where('status', 'pending')->count(),
            'queued' => $task->notifications()->where('status', 'queued')->count(),
            'success_rate' => $task->getSuccessRate(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'task' => $task,
                'stats' => $stats,
            ],
        ]);
    }
}



