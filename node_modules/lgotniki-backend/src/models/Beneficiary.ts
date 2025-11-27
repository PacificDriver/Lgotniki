import pool from '../config/database';
import { Beneficiary, BeneficiaryStatus } from '../types';
import { OperationType } from '../types';

export class BeneficiaryModel {
  static async create(data: Omit<Beneficiary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Beneficiary> {
    const result = await pool.query(
      `INSERT INTO beneficiaries (
        full_name, birth_date, phone, email, snils, hash_pan, nfc_id, rfid,
        benefit_type_id, status, residence, last_loaded_at, load_counter
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        data.fullName,
        data.birthDate,
        data.phone,
        data.email || null,
        data.snils || null,
        data.hashPan || null,
        data.nfcId || null,
        data.rfid || null,
        data.benefitTypeId || null,
        data.status || BeneficiaryStatus.ACTIVE,
        data.residence || null,
        data.lastLoadedAt || null,
        data.loadCounter || 0,
      ]
    );
    return this.mapRowToBeneficiary(result.rows[0]);
  }

  static async findById(id: string): Promise<Beneficiary | null> {
    const result = await pool.query('SELECT * FROM beneficiaries WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToBeneficiary(result.rows[0]);
  }

  static async findByPhone(phone: string): Promise<Beneficiary | null> {
    const result = await pool.query('SELECT * FROM beneficiaries WHERE phone = $1', [phone]);
    if (result.rows.length === 0) return null;
    return this.mapRowToBeneficiary(result.rows[0]);
  }

  static async findByCard(cardType: string, cardIdentifier: string): Promise<Beneficiary | null> {
    let query = '';
    switch (cardType) {
      case 'rfid':
        query = 'SELECT * FROM beneficiaries WHERE rfid = $1';
        break;
      case 'nfc':
        query = 'SELECT * FROM beneficiaries WHERE nfc_id = $1';
        break;
      case 'hash_pan':
        query = 'SELECT * FROM beneficiaries WHERE hash_pan = $1';
        break;
      default:
        return null;
    }
    const result = await pool.query(query, [cardIdentifier]);
    if (result.rows.length === 0) return null;
    return this.mapRowToBeneficiary(result.rows[0]);
  }

  static async findAll(filters?: {
    status?: BeneficiaryStatus;
    benefitTypeId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ beneficiaries: Beneficiary[]; total: number }> {
    let query = 'SELECT * FROM beneficiaries WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (filters?.status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
    }

    if (filters?.benefitTypeId) {
      paramCount++;
      query += ` AND benefit_type_id = $${paramCount}`;
      params.push(filters.benefitTypeId);
    }

    if (filters?.search) {
      paramCount++;
      query += ` AND (
        full_name ILIKE $${paramCount} OR 
        phone ILIKE $${paramCount} OR 
        email ILIKE $${paramCount} OR
        snils ILIKE $${paramCount}
      )`;
      params.push(`%${filters.search}%`);
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Ordering before pagination
    query += ' ORDER BY created_at DESC';

    // Add pagination
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
      beneficiaries: result.rows.map(this.mapRowToBeneficiary),
      total,
    };
  }

  static async update(id: string, data: Partial<Beneficiary>): Promise<Beneficiary | null> {
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
      `UPDATE beneficiaries SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return null;
    return this.mapRowToBeneficiary(result.rows[0]);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM beneficiaries WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  static async logOperation(
    beneficiaryId: string,
    operationType: OperationType,
    performedBy: string,
    performedByName: string,
    details?: Record<string, any>
  ): Promise<void> {
    await pool.query(
      `INSERT INTO beneficiary_operations 
      (beneficiary_id, operation_type, performed_by, performed_by_name, details)
      VALUES ($1, $2, $3, $4, $5)`,
      [beneficiaryId, operationType, performedBy, performedByName, details ? JSON.stringify(details) : null]
    );
  }

  static async getOperations(beneficiaryId: string): Promise<any[]> {
    const result = await pool.query(
      `SELECT * FROM beneficiary_operations 
      WHERE beneficiary_id = $1 
      ORDER BY created_at DESC`,
      [beneficiaryId]
    );
    return result.rows;
  }

  private static mapRowToBeneficiary(row: any): Beneficiary {
    return {
      id: row.id,
      fullName: row.full_name,
      birthDate: row.birth_date,
      phone: row.phone,
      email: row.email,
      snils: row.snils,
      hashPan: row.hash_pan,
      nfcId: row.nfc_id,
      rfid: row.rfid,
      benefitTypeId: row.benefit_type_id,
      status: row.status,
      residence: row.residence,
      lastLoadedAt: row.last_loaded_at,
      loadCounter: row.load_counter || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}


