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
    const result = await pool.query(
      `SELECT b.*, bt.name AS benefit_type_name, bt.description AS benefit_type_label
       FROM beneficiaries b
       LEFT JOIN benefit_types bt ON bt.id = b.benefit_type_id
       WHERE b.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return null;
    return this.mapRowToBeneficiary(result.rows[0]);
  }

  static async findByPhone(phone: string): Promise<Beneficiary | null> {
    const result = await pool.query(
      `SELECT b.*, bt.name AS benefit_type_name, bt.description AS benefit_type_label
       FROM beneficiaries b
       LEFT JOIN benefit_types bt ON bt.id = b.benefit_type_id
       WHERE b.phone = $1`,
      [phone]
    );
    if (result.rows.length === 0) return null;
    return this.mapRowToBeneficiary(result.rows[0]);
  }

  static async findByCard(cardType: string, cardIdentifier: string): Promise<Beneficiary | null> {
    let query = '';
    const baseSelect = `
      SELECT b.*, bt.name AS benefit_type_name, bt.description AS benefit_type_label
      FROM beneficiaries b
      LEFT JOIN benefit_types bt ON bt.id = b.benefit_type_id
    `;
    switch (cardType) {
      case 'rfid':
        query = `${baseSelect} WHERE b.rfid = $1`;
        break;
      case 'nfc':
        query = `${baseSelect} WHERE b.nfc_id = $1`;
        break;
      case 'hash_pan':
        query = `${baseSelect} WHERE b.hash_pan = $1`;
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
    ageFrom?: number;
    ageTo?: number;
    birthMonth?: number;
    birthDay?: number;
    residence?: string;
    beneficiaryIds?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{ beneficiaries: Beneficiary[]; total: number }> {
    let query = `
      SELECT b.*, bt.name AS benefit_type_name, bt.description AS benefit_type_label
      FROM beneficiaries b
      LEFT JOIN benefit_types bt ON bt.id = b.benefit_type_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (filters?.status) {
      paramCount++;
      query += ` AND b.status = $${paramCount}`;
      params.push(filters.status);
    }

    if (filters?.benefitTypeId) {
      paramCount++;
      query += ` AND b.benefit_type_id = $${paramCount}`;
      params.push(filters.benefitTypeId);
    }

    if (filters?.search) {
      paramCount++;
      query += ` AND (
        b.full_name ILIKE $${paramCount} OR 
        b.phone ILIKE $${paramCount} OR 
        b.email ILIKE $${paramCount} OR
        b.snils ILIKE $${paramCount}
      )`;
      params.push(`%${filters.search}%`);
    }

    // Age filter (from birth_date)
    if (filters?.ageFrom !== undefined) {
      paramCount++;
      query += ` AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, b.birth_date)) >= $${paramCount}`;
      params.push(filters.ageFrom);
    }

    if (filters?.ageTo !== undefined) {
      paramCount++;
      query += ` AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, b.birth_date)) <= $${paramCount}`;
      params.push(filters.ageTo);
    }

    // Birth month filter (1-12)
    if (filters?.birthMonth) {
      paramCount++;
      query += ` AND EXTRACT(MONTH FROM b.birth_date) = $${paramCount}`;
      params.push(filters.birthMonth);
    }

    // Birth day filter (1-31)
    if (filters?.birthDay) {
      paramCount++;
      query += ` AND EXTRACT(DAY FROM b.birth_date) = $${paramCount}`;
      params.push(filters.birthDay);
    }

    // Residence filter
    if (filters?.residence) {
      paramCount++;
      query += ` AND b.residence ILIKE $${paramCount}`;
      params.push(`%${filters.residence}%`);
    }

    // Filter by specific beneficiary IDs (has priority over other filters)
    if (filters?.beneficiaryIds && Array.isArray(filters.beneficiaryIds) && filters.beneficiaryIds.length > 0) {
      paramCount++;
      query += ` AND b.id = ANY($${paramCount}::uuid[])`;
      params.push(filters.beneficiaryIds);
    }

    // Get total count
    const countQuery = query.replace(
      'SELECT b.*, bt.name AS benefit_type_name, bt.description AS benefit_type_label',
      'SELECT COUNT(*)'
    );
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Ordering before pagination
    query += ' ORDER BY b.created_at DESC';

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
        // Handle null values explicitly for benefit_type_id
        if (key === 'benefitTypeId' && value === null) {
          values.push(null);
        } else {
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
      `UPDATE beneficiaries SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return null;
    // Return updated beneficiary with benefit type name by fetching it again
    return this.findById(id);
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
      `SELECT 
        id,
        beneficiary_id as "beneficiaryId",
        operation_type as "operationType",
        performed_by as "performedBy",
        performed_by_name as "performedByName",
        details,
        created_at as "createdAt"
      FROM beneficiary_operations 
      WHERE beneficiary_id = $1 
      ORDER BY created_at DESC`,
      [beneficiaryId]
    );
    
    // Преобразуем данные: парсим details если это JSON строка
    return result.rows.map(row => ({
      id: row.id,
      beneficiaryId: row.beneficiaryId,
      operationType: row.operationType,
      performedBy: row.performedBy,
      performedByName: row.performedByName,
      details: typeof row.details === 'string' ? JSON.parse(row.details) : row.details,
      createdAt: row.createdAt,
    }));
  }

  private static mapRowToBeneficiary(row: any): Beneficiary {
    // birth_date should now be a string in YYYY-MM-DD format from pg type parser
    // But we'll ensure it's always a string to avoid any timezone issues
    let birthDate: any = row.birth_date;
    if (birthDate instanceof Date) {
      // Fallback: if somehow it's still a Date, format it as YYYY-MM-DD in UTC
      const year = birthDate.getUTCFullYear();
      const month = String(birthDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(birthDate.getUTCDate()).padStart(2, '0');
      birthDate = `${year}-${month}-${day}`;
    } else if (typeof birthDate === 'string' && birthDate.includes('T')) {
      // If it's an ISO string, extract just the date part
      birthDate = birthDate.split('T')[0];
    }

    return {
      id: row.id,
      fullName: row.full_name,
      birthDate: birthDate as any, // Will be serialized as string in JSON
      phone: row.phone,
      email: row.email,
      snils: row.snils,
      hashPan: row.hash_pan,
      nfcId: row.nfc_id,
      rfid: row.rfid,
      benefitTypeId: row.benefit_type_id,
      benefitTypeName: row.benefit_type_name || row.benefit_type_label,
      status: row.status,
      residence: row.residence,
      lastLoadedAt: row.last_loaded_at,
      loadCounter: row.load_counter || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}


