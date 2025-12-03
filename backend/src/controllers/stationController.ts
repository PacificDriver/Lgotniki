import { Response } from 'express';
import { StationModel } from '../models/Station';
import { SyncService } from '../services/syncService';
import { AuthRequest } from '../middleware/auth';

export const listStations = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { search, isActive, limit, offset } = req.query;

    const result = await StationModel.findAll({
      search: search as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    return res.json(result);
  } catch (error) {
    console.error('List stations error:', error);
    return res.status(500).json({ error: 'Ошибка при получении списка станций' });
  }
};

export const getStation = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const station = await StationModel.findById(id);

    if (!station) {
      return res.status(404).json({ error: 'Станция не найдена' });
    }

    return res.json(station);
  } catch (error) {
    console.error('Get station error:', error);
    return res.status(500).json({ error: 'Ошибка при получении станции' });
  }
};

export const syncStations = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
    }

    console.log('Starting stations synchronization...');
    
    // Запускаем синхронизацию и ждем результата
    const result = await SyncService.syncStations(req.user.id);

    console.log('Stations synchronization completed:', result);

    if (result.success) {
      return res.json({
        message: 'Синхронизация станций завершена',
        processed: result.processed,
        created: result.created,
        updated: result.updated,
      });
    } else {
      return res.status(500).json({
        error: result.error || 'Ошибка при синхронизации станций',
        processed: result.processed,
        created: result.created,
        updated: result.updated,
      });
    }
  } catch (error: any) {
    console.error('Sync stations error:', error);
    return res.status(500).json({ error: error.message || 'Ошибка при синхронизации станций' });
  }
};

export const syncRoutes = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
    }

    console.log('Starting routes synchronization...');
    
    // Запускаем синхронизацию маршрутов из рейсов
    const result = await SyncService.syncRoutes(req.user.id);

    console.log('Routes synchronization completed:', result);

    if (result.success) {
      return res.json({
        message: 'Синхронизация маршрутов завершена',
        processed: result.processed,
        created: result.created,
        updated: result.updated,
      });
    } else {
      return res.status(500).json({
        error: result.error || 'Ошибка при синхронизации маршрутов',
        processed: result.processed,
        created: result.created,
        updated: result.updated,
      });
    }
  } catch (error: any) {
    console.error('Sync routes error:', error);
    return res.status(500).json({ error: error.message || 'Ошибка при синхронизации маршрутов' });
  }
};

export const getSyncLogs = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { syncType, limit, offset } = req.query;

    console.log('Getting sync logs with params:', { syncType, limit, offset });

    const logs = await SyncService.getSyncLogs({
      syncType: syncType as string,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    console.log(`Returning ${logs.length} sync logs`);

    return res.json(logs);
  } catch (error: any) {
    console.error('Get sync logs error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return res.status(500).json({ 
      error: error.message || 'Ошибка при получении журнала синхронизации' 
    });
  }
};

export const getRaces = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ 
        error: 'Необходимо указать параметры: from, to, date' 
      });
    }

    const races = await SyncService.getRaces(
      from as string,
      to as string,
      date as string
    );

    return res.json(races);
  } catch (error: any) {
    console.error('Get races error:', error);
    return res.status(500).json({ 
      error: error.message || 'Ошибка при получении рейсов' 
    });
  }
};

