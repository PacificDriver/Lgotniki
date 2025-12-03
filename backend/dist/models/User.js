"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserModel {
    static async create(data) {
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        const result = await database_1.default.query(`INSERT INTO users (username, email, password_hash, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, full_name, role, is_active, created_at, updated_at`, [
            data.username,
            data.email,
            passwordHash,
            data.fullName,
            data.role || 'operator',
            data.isActive ?? true,
        ]);
        return this.mapRowToUser(result.rows[0]);
    }
    static async findById(id) {
        const result = await database_1.default.query('SELECT id, username, email, full_name, role, is_active, created_at, updated_at FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToUser(result.rows[0]);
    }
    static async findByUsername(username) {
        const result = await database_1.default.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0)
            return null;
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
    static async verifyPassword(user, password) {
        return bcryptjs_1.default.compare(password, user.passwordHash);
    }
    static async listOperators() {
        const result = await database_1.default.query(`SELECT id, username, email, full_name, role, is_active, created_at, updated_at
       FROM users
       WHERE role = 'operator'
       ORDER BY created_at DESC`);
        return result.rows.map(row => this.mapRowToUser(row));
    }
    static async updateById(id, data) {
        const fields = [];
        const values = [];
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
            const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
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
        const result = await database_1.default.query(query, values);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToUser(result.rows[0]);
    }
    static async deleteById(id) {
        await database_1.default.query('DELETE FROM users WHERE id = $1', [id]);
    }
    static mapRowToUser(row) {
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
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map