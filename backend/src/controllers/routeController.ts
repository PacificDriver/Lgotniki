import { Response } from 'express';
import { RouteModel } from '../models/Route';
import { AuthRequest } from '../middleware/auth';
import pool from '../config/database';

export const listRoutes = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { search, isActive, departureStationId, arrivalStationId, routeNumber, limit, offset } = req.query;

    const result = await RouteModel.findAll({
      search: search as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      departureStationId: departureStationId as string,
      arrivalStationId: arrivalStationId as string,
      routeNumber: routeNumber as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    return res.json(result);
  } catch (error) {
    console.error('List routes error:', error);
    return res.status(500).json({ error: 'Ошибка при получении списка маршрутов' });
  }
};

export const getRouteNumbers = async (
  _req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    console.log('Getting route numbers from database...');
    
    // Сначала проверяем, сколько всего маршрутов в базе
    const totalRoutes = await pool.query('SELECT COUNT(*) as total FROM routes');
    const totalCount = parseInt(totalRoutes.rows[0].total);
    console.log(`Total routes in database: ${totalCount}`);
    
    // Проверяем активные маршруты
    const activeRoutes = await pool.query(
      'SELECT COUNT(*) as total FROM routes WHERE is_active = true'
    );
    const activeCount = parseInt(activeRoutes.rows[0].total);
    console.log(`Active routes in database: ${activeCount}`);
    
    // Проверяем маршруты с номерами
    const routesWithNumbers = await pool.query(
      'SELECT COUNT(*) as total FROM routes WHERE route_number IS NOT NULL AND route_number != \'\''
    );
    const withNumbersCount = parseInt(routesWithNumbers.rows[0].total);
    console.log(`Routes with numbers: ${withNumbersCount}`);
    
    // Получаем уникальные номера маршрутов (включая неактивные для диагностики)
    const result = await pool.query(
      `SELECT DISTINCT route_number, COUNT(*) as count
       FROM routes
       WHERE route_number IS NOT NULL AND route_number != ''
       GROUP BY route_number
       ORDER BY route_number`
    );

    console.log(`Found ${result.rows.length} unique route numbers`);

    const routeNumbers = result.rows.map(row => ({
      routeNumber: row.route_number,
      count: parseInt(row.count),
    }));

    console.log('Route numbers:', routeNumbers);
    
    // Если маршрутов нет, возвращаем пустой массив, но логируем для диагностики
    if (routeNumbers.length === 0) {
      console.warn('No route numbers found. This might mean:');
      console.warn('1. Routes have not been synced yet');
      console.warn('2. API did not return races with route numbers');
      console.warn('3. Route numbers were not extracted from races correctly');
    }

    return res.json(routeNumbers);
  } catch (error: any) {
    console.error('Get route numbers error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ error: 'Ошибка при получении номеров маршрутов' });
  }
};

export const getRoute = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const route = await RouteModel.findById(id);

    if (!route) {
      return res.status(404).json({ error: 'Маршрут не найден' });
    }

    return res.json(route);
  } catch (error) {
    console.error('Get route error:', error);
    return res.status(500).json({ error: 'Ошибка при получении маршрута' });
  }
};

export const createRoute = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const data = {
      routeNumber: req.body.routeNumber,
      departureStationId: req.body.departureStationId,
      arrivalStationId: req.body.arrivalStationId,
      durationMinutes: req.body.durationMinutes,
      distanceKm: req.body.distanceKm,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    };

    const route = await RouteModel.create(data);
    return res.status(201).json(route);
  } catch (error: any) {
    console.error('Create route error:', error);
    return res.status(500).json({ error: error.message || 'Ошибка при создании маршрута' });
  }
};

export const updateRoute = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const route = await RouteModel.findById(id);

    if (!route) {
      return res.status(404).json({ error: 'Маршрут не найден' });
    }

    const updateData: any = {};
    if (req.body.routeNumber !== undefined) updateData.routeNumber = req.body.routeNumber;
    if (req.body.departureStationId !== undefined) updateData.departureStationId = req.body.departureStationId;
    if (req.body.arrivalStationId !== undefined) updateData.arrivalStationId = req.body.arrivalStationId;
    if (req.body.durationMinutes !== undefined) updateData.durationMinutes = req.body.durationMinutes;
    if (req.body.distanceKm !== undefined) updateData.distanceKm = req.body.distanceKm;
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;

    const updated = await RouteModel.update(id, updateData);
    return res.json(updated);
  } catch (error: any) {
    console.error('Update route error:', error);
    return res.status(500).json({ error: error.message || 'Ошибка при обновлении маршрута' });
  }
};

export const deleteRoute = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const deleted = await RouteModel.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Маршрут не найден' });
    }

    return res.json({ message: 'Маршрут удален' });
  } catch (error) {
    console.error('Delete route error:', error);
    return res.status(500).json({ error: 'Ошибка при удалении маршрута' });
  }
};

