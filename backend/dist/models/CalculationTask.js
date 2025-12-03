"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculationTaskModel = void 0;
const database_1 = __importDefault(require("../config/database"));
const types_1 = require("../types");
class CalculationTaskModel {
    static async create(data) {
        const result = await database_1.default.query(`INSERT INTO calculation_tasks (
        name, description, benefit_type_id, filters, status,
        total_beneficiaries, processed_beneficiaries, error_message, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`, [
            data.name,
            data.description || null,
            data.benefitTypeId,
            data.filters ? JSON.stringify(data.filters) : null,
            data.status || types_1.TaskStatus.PENDING,
            data.totalBeneficiaries || null,
            data.processedBeneficiaries || 0,
            data.errorMessage || null,
            data.createdBy,
        ]);
        return this.mapRowToTask(result.rows[0]);
    }
    static async findById(id) {
        const result = await database_1.default.query('SELECT * FROM calculation_tasks WHERE id = $1', [id]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToTask(result.rows[0]);
    }
    static async findAll(filters) {
        let query = 'SELECT * FROM calculation_tasks WHERE 1=1';
        const params = [];
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
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
        const countResult = await database_1.default.query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);
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
        query += ' ORDER BY created_at DESC';
        const result = await database_1.default.query(query, params);
        return {
            tasks: result.rows.map(this.mapRowToTask),
            total,
        };
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 0;
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
                paramCount++;
                const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
                if (key === 'filters') {
                    fields.push(`${dbKey} = $${paramCount}`);
                    values.push(value ? JSON.stringify(value) : null);
                }
                else if (key === 'completedAt' && value) {
                    fields.push(`completed_at = $${paramCount}`);
                    values.push(value);
                }
                else {
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
        const result = await database_1.default.query(`UPDATE calculation_tasks SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToTask(result.rows[0]);
    }
    static mapRowToTask(row) {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            benefitTypeId: row.benefit_type_id,
            filters: row.filters,
            status: row.status,
            totalBeneficiaries: row.total_beneficiaries,
            processedBeneficiaries: row.processed_beneficiaries,
            errorMessage: row.error_message,
            createdBy: row.created_by,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            completedAt: row.completed_at,
        };
    }
}
exports.CalculationTaskModel = CalculationTaskModel;
//# sourceMappingURL=CalculationTask.js.map