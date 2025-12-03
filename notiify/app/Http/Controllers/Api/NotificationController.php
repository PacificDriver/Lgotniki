<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Получить список уведомлений
     * Мониторинг отправки: статус, дата/время, канал, получатель, ошибка
     */
    public function index(Request $request): JsonResponse
    {
        $query = Notification::with(['notificationTask']);

        // Фильтры
        if ($request->has('status')) {
            $status = $request->input('status');
            if (in_array($status, ['pending', 'queued', 'sent', 'failed', 'delivered'])) {
                $query->where('status', $status);
            }
        }

        if ($request->has('channel')) {
            $query->byChannel($request->input('channel'));
        }

        if ($request->has('task_id')) {
            $query->where('notification_task_id', $request->input('task_id'));
        }

        // Выбираем все поля для мониторинга:
        // - status (в очереди/отправлено/ошибка)
        // - sent_at, queued_at, failed_at (дата и время отправки)
        // - channel (канал отправки: email/WhatsApp)
        // - recipient (получатель)
        // - error_message (текст ошибки, если есть)
        $notifications = $query->select([
            'id',
            'notification_task_id',
            'channel',
            'recipient',
            'subject',
            'message',
            'status',
            'error_message',
            'retry_count',
            'queued_at',
            'sent_at',
            'delivered_at',
            'failed_at',
            'created_at',
            'updated_at',
        ])
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    /**
     * Получить информацию об уведомлении
     */
    public function show(int $id): JsonResponse
    {
        $notification = Notification::with([
            'passenger',
            'trip.route.departureStation',
            'trip.route.arrivalStation',
            'notificationTask',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $notification,
        ]);
    }
}



