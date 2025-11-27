import pool from '../config/database';
import { BenefitAssignment } from '../types';

export class BenefitAssignmentModel {
  static async create(data: Omit<BenefitAssignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<BenefitAssignment> {
    const result = await pool.query(
      `INSERT INTO benefit_assignments (
        beneficiary_id, benefit_type_id, trips_remaining, kilometers_remaining,
        discount_percent, valid_from, valid_to, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        data.beneficiaryId,
        data.benefitTypeId,
        data.tripsRemaining || null,
        data.kilometersRemaining || null,
        data.discountPercent || null,
        data.validFrom,
        data.validTo || null,
        data.isActive !== undefined ? data.isActive : true,
      ]
    );
    return this.mapRowToAssignment(result.rows[0]);
  }

  static async findById(id: string): Promise<BenefitAssignment | null> {
    const result = await pool.query('SELECT * FROM benefit_assignments WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToAssignment(result.rows[0]);
  }

  static async findByBeneficiary(beneficiaryId: string, activeOnly: boolean = true): Promise<BenefitAssignment[]> {
    let query = 'SELECT * FROM benefit_assignments WHERE beneficiary_id = $1';
    if (activeOnly) {
      query += ' AND is_active = true AND (valid_to IS NULL OR valid_to > CURRENT_TIMESTAMP)';
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, [beneficiaryId]);
    return result.rows.map(this.mapRowToAssignment);
  }

  static async update(id: string, data: Partial<BenefitAssignment>): Promise<BenefitAssignment | null> {
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
      `UPDATE benefit_assignments SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToAssignment(result.rows[0]);
  }

  private static mapRowToAssignment(row: any): BenefitAssignment {
    return {
      id: row.id,
      beneficiaryId: row.beneficiary_id,
      benefitTypeId: row.benefit_type_id,
      tripsRemaining: row.trips_remaining,
      kilometersRemaining: row.kilometers_remaining ? parseFloat(row.kilometers_remaining) : undefined,
      discountPercent: row.discount_percent,
      validFrom: row.valid_from,
      validTo: row.valid_to,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}


