import pool from '../config/database';
import { BenefitType } from '../types';

export class BenefitTypeModel {
  static async create(data: Omit<BenefitType, 'id' | 'createdAt' | 'updatedAt'>): Promise<BenefitType> {
    const result = await pool.query(
      `INSERT INTO benefit_types (
        name, description, routes, settlements, time_restrictions,
        calculation_type, calculation_params, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        data.name,
        data.description || null,
        data.routes || null,
        data.settlements || null,
        data.timeRestrictions ? JSON.stringify(data.timeRestrictions) : null,
        data.calculationType,
        data.calculationParams ? JSON.stringify(data.calculationParams) : null,
        data.isActive !== undefined ? data.isActive : true,
      ]
    );
    return this.mapRowToBenefitType(result.rows[0]);
  }

  static async findById(id: string): Promise<BenefitType | null> {
    const result = await pool.query('SELECT * FROM benefit_types WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToBenefitType(result.rows[0]);
  }

  static async findAll(activeOnly: boolean = false): Promise<BenefitType[]> {
    let query = 'SELECT * FROM benefit_types';
    if (activeOnly) {
      query += ' WHERE is_active = true';
    }
    query += ' ORDER BY name';
    const result = await pool.query(query);
    return result.rows.map(this.mapRowToBenefitType);
  }

  static async update(id: string, data: Partial<BenefitType>): Promise<BenefitType | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
        paramCount++;
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        
        if (key === 'routes' || key === 'settlements') {
          fields.push(`${dbKey} = $${paramCount}`);
          values.push(value);
        } else if (key === 'timeRestrictions' || key === 'calculationParams') {
          fields.push(`${dbKey} = $${paramCount}`);
          values.push(value ? JSON.stringify(value) : null);
        } else {
          fields.push(`${dbKey} = $${paramCount}`);
          values.push(value);
        }
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    paramCount++;
    values.push(id);

    const result = await pool.query(
      `UPDATE benefit_types SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToBenefitType(result.rows[0]);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM benefit_types WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  private static mapRowToBenefitType(row: any): BenefitType {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      routes: row.routes || [],
      settlements: row.settlements || [],
      timeRestrictions: row.time_restrictions,
      calculationType: row.calculation_type,
      calculationParams: row.calculation_params,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}


