import pool from '../config/database';

export interface Station {
  id: string;
  externalId: string;
  name: string;
  code?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class StationModel {
  static async create(data: Omit<Station, 'id' | 'createdAt' | 'updatedAt'>): Promise<Station> {
    const result = await pool.query(
      `INSERT INTO stations (
        external_id, name, code, city, region, latitude, longitude, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        data.externalId,
        data.name,
        data.code || null,
        data.city || null,
        data.region || null,
        data.latitude || null,
        data.longitude || null,
        data.isActive !== undefined ? data.isActive : true,
      ]
    );
    return this.mapRowToStation(result.rows[0]);
  }

  static async findById(id: string): Promise<Station | null> {
    const result = await pool.query('SELECT * FROM stations WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToStation(result.rows[0]);
  }

  static async findByExternalId(externalId: string): Promise<Station | null> {
    const result = await pool.query('SELECT * FROM stations WHERE external_id = $1', [externalId]);
    if (result.rows.length === 0) return null;
    return this.mapRowToStation(result.rows[0]);
  }

  static async findAll(filters?: {
    search?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ stations: Station[]; total: number }> {
    let query = 'SELECT * FROM stations WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (filters?.isActive !== undefined) {
      paramCount++;
      query += ` AND is_active = $${paramCount}`;
      params.push(filters.isActive);
    }

    if (filters?.search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR city ILIKE $${paramCount} OR code ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    query += ' ORDER BY name';

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
      stations: result.rows.map(this.mapRowToStation),
      total,
    };
  }

  static async update(id: string, data: Partial<Station>): Promise<Station | null> {
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
      `UPDATE stations SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToStation(result.rows[0]);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM stations WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  private static mapRowToStation(row: any): Station {
    return {
      id: row.id,
      externalId: row.external_id,
      name: row.name,
      code: row.code,
      city: row.city,
      region: row.region,
      latitude: row.latitude ? parseFloat(row.latitude) : undefined,
      longitude: row.longitude ? parseFloat(row.longitude) : undefined,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

