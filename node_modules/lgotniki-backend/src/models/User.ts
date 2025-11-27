import pool from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  static async create(data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role?: string;
    isActive?: boolean;
  }): Promise<Omit<User, 'passwordHash'>> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, full_name, role, is_active, created_at, updated_at`,
      [
        data.username,
        data.email,
        passwordHash,
        data.fullName,
        data.role || 'operator',
        data.isActive ?? true,
      ]
    );
    return this.mapRowToUser(result.rows[0]);
  }

  static async findById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const result = await pool.query(
      'SELECT id, username, email, full_name, role, is_active, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return this.mapRowToUser(result.rows[0]);
  }

  static async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return null;
    return {
      id: result.rows[0].id,
      username: result.rows[0].username,
      email: result.rows[0].email,
      passwordHash: result.rows[0].password_hash,
      fullName: result.rows[0].full_name,
      role: result.rows[0].role,
      isActive: result.rows[0].is_active,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
    };
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  static async listOperators(): Promise<Array<Omit<User, 'passwordHash'>>> {
    const result = await pool.query(
      `SELECT id, username, email, full_name, role, is_active, created_at, updated_at
       FROM users
       WHERE role = 'operator'
       ORDER BY created_at DESC`
    );
    return result.rows.map(row => this.mapRowToUser(row));
  }

  static async updateById(
    id: string,
    data: {
      username?: string;
      email?: string;
      fullName?: string;
      password?: string;
      role?: string;
      isActive?: boolean;
    }
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (data.username !== undefined) {
      fields.push(`username = $${index++}`);
      values.push(data.username);
    }

    if (data.email !== undefined) {
      fields.push(`email = $${index++}`);
      values.push(data.email);
    }

    if (data.fullName !== undefined) {
      fields.push(`full_name = $${index++}`);
      values.push(data.fullName);
    }

    if (data.password) {
      const passwordHash = await bcrypt.hash(data.password, 10);
      fields.push(`password_hash = $${index++}`);
      values.push(passwordHash);
    }

    if (data.role !== undefined) {
      fields.push(`role = $${index++}`);
      values.push(data.role);
    }

    if (typeof data.isActive === 'boolean') {
      fields.push(`is_active = $${index++}`);
      values.push(data.isActive);
    }

    if (!fields.length) {
      return this.findById(id);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${index}
      RETURNING id, username, email, full_name, role, is_active, created_at, updated_at
    `;

    values.push(id);

    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    return this.mapRowToUser(result.rows[0]);
  }

  static async deleteById(id: string): Promise<void> {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }

  private static mapRowToUser(row: any): Omit<User, 'passwordHash'> {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      fullName: row.full_name,
      role: row.role,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}


