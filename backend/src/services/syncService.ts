import { StationModel } from '../models/Station';
import { RouteModel } from '../models/Route';
import pool from '../config/database';

// Используем встроенный fetch API Node.js 18+
// URL из notiify: http://rc.rfbus.ru:8086
const API_BASE_URL = process.env.CARRIER_API_URL || 'http://rc.rfbus.ru:8086';
const API_TOKEN = process.env.CARRIER_API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoiODUzMzYiLCJpZF9hdiI6IjMwMzY2IiwiaWRfZmlybSI6IjEwMzc2IiwiaWF0IjoxNzQ2MDAwODIyLCJleHAiOjE3Nzc1MzY4MjJ9.bjXTtY0xHTGVZcFegx9zGDRulNKxqBe4UBfKt4u3ER8';

async function apiRequest(endpoint: string, params?: Record<string, string>): Promise<any> {
  try {
    const url = new URL(endpoint, API_BASE_URL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    console.log(`Making API request to: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      headers: {
        'x-access-token': API_TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(30000), // 30 секунд таймаут
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data: any = await response.json();
    
    // Поддерживаем различные форматы ответов
    // Формат 1: {"data": [...]}
    // Формат 2: [...] (прямой массив)
    // Формат 3: {"result": [...]}
    const result = (data && typeof data === 'object' && 'data' in data) 
      ? data.data 
      : (data && typeof data === 'object' && 'result' in data)
      ? data.result
      : data ?? [];
    
    // Убеждаемся, что возвращаем массив
    return Array.isArray(result) ? result : [];
  } catch (error: any) {
    // Улучшенная обработка ошибок fetch
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      console.error('API request timeout after 30 seconds');
      throw new Error('Timeout: запрос к API превысил время ожидания (30 секунд)');
    }
    if (error.message?.includes('fetch failed') || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('API connection error:', error.message, error.code);
      throw new Error(`Ошибка подключения к API (${API_BASE_URL}): ${error.message || 'Сервер недоступен'}`);
    }
    // Пробрасываем другие ошибки как есть
    console.error('API request error:', error);
    throw error;
  }
}

interface StationFromAPI {
  id?: string;
  station_id?: string;
  code?: string;
  name?: string;
  title?: string;
  station_name?: string;
  city?: string;
  city_name?: string;
  settlement?: string;
  region?: string;
  region_name?: string;
  latitude?: number;
  lat?: number;
  coord_lat?: number;
  longitude?: number;
  lng?: number;
  lon?: number;
  coord_lng?: number;
  is_active?: boolean;
  active?: boolean;
  [key: string]: any;
}

interface RaceFromAPI {
  id: string;
  active: boolean;
  route_tz: number;
  dt_depart: string;
  dt_arrive: string;
  route?: string; // API возвращает номер маршрута в поле 'route' (например, "507")
  route_number?: string; // Нормализованное поле
  routeNumber?: string;
  number?: string;
  trip_number?: string;
  route_id?: string;
  from_station?: string;
  to_station?: string;
  [key: string]: any;
}

export class SyncService {
  /**
   * Синхронизация станций из внешнего API
   */
  static async syncStations(userId?: string): Promise<{
    success: boolean;
    processed: number;
    created: number;
    updated: number;
    error?: string;
  }> {
    let processed = 0;
    let created = 0;
    let updated = 0;
    let errorMessage: string | undefined;

    try {
      console.log('Starting stations sync...');
      console.log(`API URL: ${API_BASE_URL}`);
      
      // Получаем станции из API
      let stations: StationFromAPI[];
      try {
        stations = await apiRequest('/stations') as StationFromAPI[];
        console.log(`Received ${stations.length} stations from API`);
      } catch (apiError: any) {
        console.error('Error fetching stations from API:', apiError);
        throw new Error(`Ошибка получения данных от API: ${apiError.message}`);
      }

      for (const stationData of stations) {
        try {
          processed++;

          // API может возвращать станции в разных форматах
          // Поддерживаем id, code, name как идентификаторы
          const identifier = stationData.id ?? stationData.code ?? stationData.name ?? null;
          
          if (!identifier) {
            console.warn('Station without identifier skipped', { stationData });
            continue;
          }

          // Определяем external_id из ответа API
          const externalId = String(
            stationData.id ?? 
            stationData.station_id ?? 
            stationData.code ?? 
            identifier
          );

          // Проверяем, существует ли станция по external_id
          const existing = await StationModel.findByExternalId(externalId);

          // Подготавливаем данные для обновления/создания
          const city = stationData.city ?? 
                       stationData.city_name ?? 
                       stationData.settlement ?? 
                       undefined;
          
          const region = stationData.region ?? 
                         stationData.region_name ?? 
                         undefined;
          
          const latitude = stationData.latitude ?? 
                           stationData.lat ?? 
                           stationData.coord_lat ?? 
                           undefined;
          
          const longitude = stationData.longitude ?? 
                            stationData.lng ?? 
                            stationData.lon ?? 
                            stationData.coord_lng ?? 
                            undefined;

          const stationPayload = {
            externalId: externalId,
            name: stationData.name ?? 
                  stationData.title ?? 
                  stationData.station_name ?? 
                  'Unknown',
            code: String(
              stationData.id ?? 
              stationData.code ?? 
              stationData.station_id ?? 
              ''
            ),
            city: city || undefined,
            region: region || undefined,
            latitude: latitude || undefined,
            longitude: longitude || undefined,
            isActive: stationData.is_active ?? 
                      stationData.active ?? 
                      true,
          };

          if (existing) {
            // Обновляем существующую
            await StationModel.update(existing.id, stationPayload);
            updated++;
          } else {
            // Создаем новую
            await StationModel.create(stationPayload);
            created++;
          }
        } catch (error: any) {
          console.error(`Error processing station:`, error.message, stationData);
        }
      }

      // Записываем в журнал синхронизации
      try {
        const logResult = await pool.query(
          `INSERT INTO sync_logs (
            sync_type, status, records_processed, records_created, records_updated, performed_by, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING id`,
          ['stations', 'success', processed, created, updated, userId || null]
        );
        console.log('Sync log created:', logResult.rows[0]?.id);
      } catch (logError: any) {
        // Если таблица не существует, просто логируем
        if (logError.message?.includes('does not exist') || logError.code === '42P01') {
          console.warn('Table sync_logs does not exist. Run migration first.');
        } else {
          console.error('Error writing sync log:', logError);
          console.error('Log error details:', {
            message: logError.message,
            code: logError.code,
            detail: logError.detail,
          });
        }
      }

      console.log(`Stations sync completed: ${created} created, ${updated} updated`);

      // После синхронизации станций, синхронизируем маршруты
      console.log('Starting routes sync after stations sync...');
      try {
        const routesResult = await this.syncRoutes(userId);
        console.log(`Routes sync completed: ${routesResult.created} created, ${routesResult.updated} updated`);
      } catch (routesError: any) {
        console.warn('Routes sync failed, but stations sync was successful:', routesError.message);
        // Не прерываем выполнение, если синхронизация маршрутов не удалась
      }

      return {
        success: true,
        processed,
        created,
        updated,
      };
    } catch (error: any) {
      console.error('Stations sync error:', error);
      errorMessage = error.message;

      // Записываем ошибку в журнал
      try {
        const logResult = await pool.query(
          `INSERT INTO sync_logs (
            sync_type, status, records_processed, records_created, records_updated, error_message, performed_by, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP) RETURNING id`,
          ['stations', 'failed', processed, created, updated, errorMessage, userId || null]
        );
        console.log('Sync log (error) created:', logResult.rows[0]?.id);
      } catch (logError: any) {
        // Игнорируем ошибку, если таблицы нет
        if (logError.message?.includes('does not exist') || logError.code === '42P01') {
          console.warn('Table sync_logs does not exist. Run migration first.');
        } else {
          console.error('Error writing sync log:', logError);
          console.error('Log error details:', {
            message: logError.message,
            code: logError.code,
            detail: logError.detail,
          });
        }
      }

      return {
        success: false,
        processed,
        created,
        updated,
        error: errorMessage,
      };
    }
  }

  /**
   * Синхронизация маршрутов из рейсов внешнего API
   * Извлекает уникальные маршруты из рейсов за последние N дней
   */
  static async syncRoutes(userId?: string): Promise<{
    success: boolean;
    processed: number;
    created: number;
    updated: number;
    error?: string;
  }> {
    let processed = 0;
    let created = 0;
    let updated = 0;
    let errorMessage: string | undefined;

    try {
      console.log('Starting routes sync from races...');

      // Получаем список активных станций
      const stationsResult = await StationModel.findAll({ isActive: true });
      const stations = stationsResult.stations || [];
      console.log(`Found ${stations.length} active stations`);

      if (stations.length === 0) {
        throw new Error('Нет активных станций. Сначала синхронизируйте станции.');
      }

      // Получаем рейсы за несколько ближайших дней
      const today = new Date();
      const routesMap = new Map<string, any>();

      // Форматируем дату в формат API (DD.MM.YY)
      const formatDateForAPI = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}.${month}.${year}`;
      };

      // Проверяем несколько дат (от недели назад до недели вперед) для увеличения шанса найти рейсы
      const datesToCheck: string[] = [];
      for (let i = -7; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        datesToCheck.push(formatDateForAPI(date));
      }
      
      console.log(`Checking races for dates: ${datesToCheck.slice(0, 3).join(', ')}...${datesToCheck.slice(-3).join(', ')} (${datesToCheck.length} dates total)`);

      // Сначала пробуем известные рабочие ID станций из примера (62686, 50475)
      console.log(`\n=== TEST REQUEST (Known working stations) ===`);
      const knownStationIds = ['62686', '50475'];
      let foundWorkingPair = false;
      
      for (let i = 0; i < knownStationIds.length - 1 && !foundWorkingPair; i++) {
        for (let j = i + 1; j < knownStationIds.length && !foundWorkingPair; j++) {
          const fromId = knownStationIds[i];
          const toId = knownStationIds[j];
          
          // Проверяем несколько дат для этой пары
          for (const testDate of datesToCheck.slice(0, 5)) {
            try {
              console.log(`Testing: from=${fromId}, to=${toId}, date=${testDate}`);
              const testRaces = await apiRequest('/races', {
                from: fromId,
                to: toId,
                date: testDate,
              }) as RaceFromAPI[];
              
              if (testRaces.length > 0) {
                console.log(`✓ Found ${testRaces.length} races!`);
                console.log('Sample race structure:', JSON.stringify(testRaces[0], null, 2));
                console.log('Race keys:', Object.keys(testRaces[0]));
                foundWorkingPair = true;
                break;
              }
            } catch (testError: any) {
              // Игнорируем ошибки для тестовых запросов
            }
          }
        }
      }
      
      // Также пробуем первую пару станций из базы, если известные не сработали
      if (!foundWorkingPair && stations.length >= 2) {
        const testFrom = stations[0] as any;
        const testTo = stations[1] as any;
        console.log(`\n=== TEST REQUEST (First stations from DB) ===`);
        console.log(`Testing API with: from=${testFrom.externalId}, to=${testTo.externalId}`);
        
        for (const testDate of datesToCheck.slice(0, 3)) {
          try {
            const testRaces = await apiRequest('/races', {
              from: testFrom.externalId,
              to: testTo.externalId,
              date: testDate,
            }) as RaceFromAPI[];
            
            if (testRaces.length > 0) {
              console.log(`✓ Found ${testRaces.length} races on ${testDate}!`);
              console.log('Sample race structure:', JSON.stringify(testRaces[0], null, 2));
              foundWorkingPair = true;
              break;
            }
          } catch (testError: any) {
            // Игнорируем ошибки
          }
        }
      }
      
      console.log(`=== END TEST ===\n`);

      // Настраиваем параметры для проверки
      let requestCount = 0;
      const maxRequests = 100; // Увеличиваем до 100 запросов

      // Проверяем больше пар станций и расширяем диапазон дат
      // Сначала проверяем известные рабочие станции с расширенным диапазоном дат
      console.log('Starting routes extraction from known working stations...');
      
      // Проверяем известные рабочие ID станций с расширенным диапазоном дат
      const knownWorkingPairs = [
        { from: '62686', to: '50475' }, // Из рабочего примера
      ];
      
      for (const pair of knownWorkingPairs) {
        if (requestCount >= maxRequests) break;
        
        for (const date of datesToCheck) {
          if (requestCount >= maxRequests) break;
          
          try {
            requestCount++;
            console.log(`Request ${requestCount}/${maxRequests}: Known pair ${pair.from} -> ${pair.to} on ${date}`);
            
            const races = await apiRequest('/races', {
              from: pair.from,
              to: pair.to,
              date,
            }) as RaceFromAPI[];

            if (races.length > 0) {
              console.log(`✓ Found ${races.length} races for ${pair.from} -> ${pair.to} on ${date}`);
              // Обрабатываем найденные рейсы
              for (const race of races) {
                const routeNumber = race.route_number || race.route || race.routeNumber || null;
                if (routeNumber) {
                  // Находим станции по external_id
                  const fromStation = stations.find((s: any) => s.externalId === pair.from);
                  const toStation = stations.find((s: any) => s.externalId === pair.to);
                  
                  if (fromStation && toStation) {
                    const routeKey = `${routeNumber}_${fromStation.id}_${toStation.id}`;
                    if (!routesMap.has(routeKey)) {
                      routesMap.set(routeKey, {
                        routeNumber: String(routeNumber),
                        departureStationId: fromStation.id,
                        arrivalStationId: toStation.id,
                        externalId: race.id,
                      });
                      console.log(`✓ Found route: ${routeNumber} from race ${race.id}`);
                    }
                  }
                }
              }
              // Если нашли рейсы, можем перейти к следующей паре
              break;
            }
          } catch (error: any) {
            console.warn(`Error checking known pair ${pair.from} -> ${pair.to} on ${date}:`, error.message);
          }
        }
      }

      // Затем проверяем пары станций из базы данных
      const maxStationPairs = Math.min(20, stations.length); // Увеличиваем до 20 пар

      console.log(`Checking ${maxStationPairs} station pairs from database...`);
      for (let i = 0; i < maxStationPairs && requestCount < maxRequests; i++) {
        for (let j = i + 1; j < maxStationPairs && requestCount < maxRequests; j++) {
          const fromStation = stations[i] as any;
          const toStation = stations[j] as any;

          if (requestCount >= maxRequests) break;
          
          // Проверяем все доступные даты для этой пары станций
          for (const date of datesToCheck) {
            if (requestCount >= maxRequests) break;
            
            console.log(`Checking route: ${fromStation.externalId} -> ${toStation.externalId} on ${date}`);

          try {
            requestCount++;
            console.log(`Request ${requestCount}/${maxRequests}: ${fromStation.externalId} -> ${toStation.externalId} on ${date}`);
            
            const races = await apiRequest('/races', {
              from: fromStation.externalId,
              to: toStation.externalId,
              date,
            }) as RaceFromAPI[];

            console.log(`Received ${races.length} races for ${fromStation.externalId} -> ${toStation.externalId} on ${date}`);
            
            if (races.length === 0) {
              console.log(`No races found for ${fromStation.externalId} -> ${toStation.externalId} on ${date}`);
            } else {
              console.log('Sample race data (first race):', JSON.stringify(races[0], null, 2));
              console.log('All race keys in first race:', Object.keys(races[0] || {}));
            }

            for (const race of races) {
              // Проверяем разные варианты названий поля с номером маршрута
              // Приоритет: route_number (нормализованное) > route (из API) > routeNumber > number > route_id
              const routeNumber = race.route_number || 
                                 race.route ||  // API может возвращать 'route' вместо 'route_number'
                                 race.routeNumber || 
                                 race.number ||
                                 race.trip_number || // Иногда используется trip_number
                                 (race as any).route_id ||
                                 null;
              
              if (routeNumber) {
                const routeKey = `${routeNumber}_${fromStation.id}_${toStation.id}`;
                
                if (!routesMap.has(routeKey)) {
                  routesMap.set(routeKey, {
                    routeNumber: String(routeNumber),
                    departureStationId: fromStation.id,
                    arrivalStationId: toStation.id,
                    externalId: race.id,
                  });
                  console.log(`Found route: ${routeNumber} from race ${race.id}`);
                }
              } else {
                console.warn('Race without route_number. Race data:', JSON.stringify(race, null, 2));
              }
              processed++;
            }

            // Небольшая задержка между запросами, чтобы не перегружать API
            if (requestCount < maxRequests) {
              await new Promise(resolve => setTimeout(resolve, 100)); // 100ms задержка
            }
            
            // Если нашли рейсы, можем остановиться для этой пары станций
            if (races.length > 0) {
              console.log(`Found ${races.length} races, stopping date check for this station pair`);
              break;
            }
          } catch (error: any) {
            // Игнорируем ошибки для конкретных пар станций/дат
            console.warn(`Error fetching races ${fromStation.externalId} -> ${toStation.externalId} on ${date}:`, error.message);
          }
          }
        }
      }

      console.log(`Completed ${requestCount} API requests, found ${routesMap.size} unique routes`);
      
      if (routesMap.size === 0) {
        console.warn('WARNING: No routes found in races! This might mean:');
        console.warn('1. API does not return races for the checked dates');
        console.warn('2. Races do not contain route_number field');
        console.warn('3. Check the "Sample race data" logs above to see the structure');
      }

      console.log(`Found ${routesMap.size} unique routes from races`);

      // Создаем/обновляем маршруты
      console.log(`Creating/updating ${routesMap.size} routes...`);
      
      if (routesMap.size > 0) {
        console.log('Routes to create/update:', Array.from(routesMap.values()).map(r => r.routeNumber));
      }
      
      for (const routeData of routesMap.values()) {
        try {
          // Ищем существующий маршрут
          const existing = await RouteModel.findAll({
            routeNumber: routeData.routeNumber,
            departureStationId: routeData.departureStationId,
            arrivalStationId: routeData.arrivalStationId,
          });

          if (existing.routes.length > 0) {
            // Обновляем существующий
            await RouteModel.update(existing.routes[0].id, {
              externalId: routeData.externalId,
              isActive: true,
            });
            updated++;
            console.log(`Updated route: ${routeData.routeNumber} (${routeData.departureStationId} -> ${routeData.arrivalStationId})`);
          } else {
            // Создаем новый
            await RouteModel.create({
              externalId: routeData.externalId,
              routeNumber: routeData.routeNumber,
              departureStationId: routeData.departureStationId,
              arrivalStationId: routeData.arrivalStationId,
              isActive: true,
            });
            created++;
            console.log(`Created route: ${routeData.routeNumber} (${routeData.departureStationId} -> ${routeData.arrivalStationId})`);
          }
        } catch (error: any) {
          console.error(`Error processing route ${routeData.routeNumber}:`, error.message);
          console.error('Error details:', error);
        }
      }
      
      console.log(`Routes sync: ${created} created, ${updated} updated`);

      // Записываем в журнал синхронизации
      try {
        await pool.query(
          `INSERT INTO sync_logs (
            sync_type, status, records_processed, records_created, records_updated, performed_by, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING id`,
          ['routes', 'success', processed, created, updated, userId || null]
        );
      } catch (logError: any) {
        if (!logError.message?.includes('does not exist') && logError.code !== '42P01') {
          console.error('Error writing sync log:', logError);
        }
      }

      console.log(`Routes sync completed: ${created} created, ${updated} updated`);

      return {
        success: true,
        processed,
        created,
        updated,
      };
    } catch (error: any) {
      console.error('Routes sync error:', error);
      errorMessage = error.message;

      try {
        await pool.query(
          `INSERT INTO sync_logs (
            sync_type, status, records_processed, records_created, records_updated, error_message, performed_by, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP) RETURNING id`,
          ['routes', 'failed', processed, created, updated, errorMessage, userId || null]
        );
      } catch (logError: any) {
        if (!logError.message?.includes('does not exist') && logError.code !== '42P01') {
          console.error('Error writing sync log:', logError);
        }
      }

      return {
        success: false,
        processed,
        created,
        updated,
        error: errorMessage,
      };
    }
  }

  /**
   * Получение рейсов из внешнего API
   * @param fromId ID станции отправления
   * @param toId ID станции прибытия
   * @param date Дата в формате DD.MM.YY
   */
  static async getRaces(
    fromId: string,
    toId: string,
    date: string
  ): Promise<RaceFromAPI[]> {
    try {
      const races = await apiRequest('/races', {
        from: fromId,
        to: toId,
        date,
      }) as RaceFromAPI[];

      return races;
    } catch (error: any) {
      console.error('Get races error:', error);
      throw new Error(`Ошибка получения рейсов: ${error.message}`);
    }
  }

  /**
   * Проверка доступности внешнего API
   */
  static async checkAPIConnection(): Promise<boolean> {
    try {
      await apiRequest('/stations', { limit: '1' });
      return true;
    } catch (error) {
      console.error('API connection check failed:', error);
      return false;
    }
  }

  /**
   * Получение журнала синхронизации
   */
  static async getSyncLogs(filters?: {
    syncType?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    try {
      let query = 'SELECT * FROM sync_logs WHERE 1=1';
      const params: any[] = [];
      let paramCount = 0;

      if (filters?.syncType) {
        paramCount++;
        query += ` AND sync_type = $${paramCount}`;
        params.push(filters.syncType);
      }

      query += ' ORDER BY created_at DESC';

      if (filters?.limit) {
        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(filters.limit);
      }

      if (filters?.offset) {
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(filters.offset);
      }

      console.log('Getting sync logs with query:', query, 'params:', params);
      const result = await pool.query(query, params);
      console.log(`Found ${result.rows.length} sync logs`);
      return result.rows;
    } catch (error: any) {
      // Если таблица не существует, возвращаем пустой массив
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        console.warn('Table sync_logs does not exist yet. Run migration first.');
        console.warn('Error details:', error.message, error.code);
        return [];
      }
      console.error('Error getting sync logs:', error);
      throw error;
    }
  }
}

