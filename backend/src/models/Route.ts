import pool from '../config/database';

export interface Route {
  id: string;
  externalId?: string;
  routeNumber: string;
  departureStationId: string;
  arrivalStationId: string;
  durationMinutes?: number;
  distanceKm?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Joined fields
  departureStationName?: string;
  arrivalStationName?: string;
}

export class RouteModel {
  static async create(data: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Promise<Route> {
    const result = await pool.query(
      `INSERT INTO routes (
        external_id, route_number, departure_station_id, arrival_station_id,
        duration_minutes, distance_km, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        data.externalId || null,
        data.routeNumber,
        data.departureStationId,
        data.arrivalStationId,
        data.durationMinutes || null,
        data.distanceKm || null,
        data.isActive !== undefined ? data.isActive : true,
      ]
    );
    return this.mapRowToRoute(result.rows[0]);
  }

  static async findById(id: string): Promise<Route | null> {
    const result = await pool.query(
      `SELECT r.*, 
        ds.name as departure_station_name,
        arr.name as arrival_station_name
      FROM routes r
      LEFT JOIN stations ds ON ds.id = r.departure_station_id
      LEFT JOIN stations arr ON arr.id = r.arrival_station_id
      WHERE r.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return null;
    return this.mapRowToRoute(result.rows[0]);
  }

  static async findByRouteNumber(routeNumber: string): Promise<Route[]> {
    const result = await pool.query(
      `SELECT r.*, 
        ds.name as departure_station_name,
        arr.name as arrival_station_name
      FROM routes r
      LEFT JOIN stations ds ON ds.id = r.departure_station_id
      LEFT JOIN stations arr ON arr.id = r.arrival_station_id
      WHERE r.route_number = $1 AND r.is_active = true`,
      [routeNumber]
    );
    return result.rows.map(this.mapRowToRoute);
  }

  static async findAll(filters?: {
    search?: string;
    isActive?: boolean;
    departureStationId?: string;
    arrivalStationId?: string;
    routeNumber?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ routes: Route[]; total: number }> {
    let query = `
      SELECT r.*, 
        ds.name as departure_station_name,
        arr.name as arrival_station_name
      FROM routes r
      LEFT JOIN stations ds ON ds.id = r.departure_station_id
      LEFT JOIN stations arr ON arr.id = r.arrival_station_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (filters?.isActive !== undefined) {
      paramCount++;
      query += ` AND r.is_active = $${paramCount}`;
      params.push(filters.isActive);
    }

    if (filters?.departureStationId) {
      paramCount++;
      query += ` AND r.departure_station_id = $${paramCount}`;
      params.push(filters.departureStationId);
    }

    if (filters?.arrivalStationId) {
      paramCount++;
      query += ` AND r.arrival_station_id = $${paramCount}`;
      params.push(filters.arrivalStationId);
    }

    if (filters?.routeNumber) {
      paramCount++;
      query += ` AND r.route_number = $${paramCount}`;
      params.push(filters.routeNumber);
    }

    if (filters?.search) {
      paramCount++;
      query += ` AND (r.route_number ILIKE $${paramCount} OR ds.name ILIKE $${paramCount} OR arr.name ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }

    // Get total count
    const countQuery = query.replace(
      'SELECT r.*, ds.name as departure_station_name, arr.name as arrival_station_name',
      'SELECT COUNT(*)'
    );
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    query += ' ORDER BY r.route_number, ds.name';

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

    const result = await pool.query(query, params);
    return {
      routes: result.rows.map(this.mapRowToRoute),
      total,
    };
  }

  static async update(id: string, data: Partial<Route>): Promise<Route | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
        paramCount++;
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    paramCount++;
    values.push(id);

    const result = await pool.query(
      `UPDATE routes SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToRoute(result.rows[0]);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM routes WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  private static mapRowToRoute(row: any): Route {
    return {
      id: row.id,
      externalId: row.external_id,
      routeNumber: row.route_number,
      departureStationId: row.departure_station_id,
      arrivalStationId: row.arrival_station_id,
      durationMinutes: row.duration_minutes,
      distanceKm: row.distance_km ? parseFloat(row.distance_km) : undefined,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      departureStationName: row.departure_station_name,
      arrivalStationName: row.arrival_station_name,
    };
  }
}

