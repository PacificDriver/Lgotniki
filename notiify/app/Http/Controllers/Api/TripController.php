<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Station;
use App\Services\CarrierApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TripController extends Controller
{
    protected CarrierApiService $carrierApiService;

    public function __construct(CarrierApiService $carrierApiService)
    {
        $this->carrierApiService = $carrierApiService;
    }

    /**
     * Получить список отмененных рейсов из API перевозчика
     * GET /races?from={id_from}&to={id_to}&date={DD.MM.YY}
     * Фильтрация: active = false (отмененные рейсы)
     */
    public function getCancelled(Request $request): JsonResponse
    {
        $request->validate([
            'from' => 'required|exists:stations,id', // ID станции отправления
            'to' => 'required|exists:stations,id', // ID станции прибытия
            'date' => 'required|date', // Дата в формате YYYY-MM-DD
        ]);

        try {
            // Получаем станции для получения external_id
            $fromStation = Station::findOrFail($request->input('from'));
            $toStation = Station::findOrFail($request->input('to'));

            if (!$fromStation->external_id || !$toStation->external_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Станции не синхронизированы с API перевозчика. Выполните синхронизацию станций.',
                ], 400);
            }

            // Форматируем дату для API (DD.MM.YY с ведущими нулями)
            $date = Carbon::parse($request->input('date'));
            $formattedDate = $date->format('d.m.y'); // DD.MM.YY с ведущими нулями (например: 22.10.25)

            // Получаем рейсы из API
            $races = $this->carrierApiService->getRaces(
                (int)$fromStation->external_id,
                (int)$toStation->external_id,
                $formattedDate
            );

            // Фильтруем отмененные рейсы (active = false)
            // Проверяем как булево значение, так и строковое представление
            $cancelledRaces = array_filter($races, function ($race) {
                if (!isset($race['active'])) {
                    return false;
                }
                // Обрабатываем как булево, так и строковое значение
                $active = $race['active'];
                return $active === false || $active === 'false' || $active === 0 || $active === '0';
            });

            // Преобразуем в нумерованный массив и сохраняем все поля из API
            $cancelledRaces = array_values($cancelledRaces);

            // Возвращаем полную структуру ответа API с обязательными полями:
            // id, active, route_tz, dt_depart, dt_arrive и другие
            return response()->json([
                'success' => true,
                'data' => $cancelledRaces,
                'count' => count($cancelledRaces),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при получении рейсов: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Получить информацию о конкретном рейсе
     */
    public function show(int $id): JsonResponse
    {
        $trip = Trip::with([
            'route.departureStation',
            'route.arrivalStation',
            'passengers'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $trip,
        ]);
    }
}



