"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenefitTypeModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class BenefitTypeModel {
    static async create(data) {
        const result = await database_1.default.query(`INSERT INTO benefit_types (
        name, description, routes, settlements, time_restrictions,
        calculation_type, calculation_params, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`, [
            data.name,
            data.description || null,
            data.routes || null,
            data.settlements || null,
            data.timeRestrictions ? JSON.stringify(data.timeRestrictions) : null,
            data.calculationType,
            data.calculationParams ? JSON.stringify(data.calculationParams) : null,
            data.isActive !== undefined ? data.isActive : true,
        ]);
        return this.mapRowToBenefitType(result.rows[0]);
    }
    static async findById(id) {
        const result = await database_1.default.query('SELECT * FROM benefit_types WHERE id = $1', [id]);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToBenefitType(result.rows[0]);
    }
    static async findAll(activeOnly = false) {
        let query = 'SELECT * FROM benefit_types';
        if (activeOnly) {
            query += ' WHERE is_active = true';
        }
        query += ' ORDER BY name';
        const result = await database_1.default.query(query);
        return result.rows.map(this.mapRowToBenefitType);
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 0;
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
                paramCount++;
                const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
                if (key === 'routes' || key === 'settlements') {
                    fields.push(`${dbKey} = $${paramCount}`);
                    values.push(value);
                }
                else if (key === 'timeRestrictions' || key === 'calculationParams') {
                    fields.push(`${dbKey} = $${paramCount}`);
                    values.push(value ? JSON.stringify(value) : null);
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
        const result = await database_1.default.query(`UPDATE benefit_types SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
        if (result.rows.length === 0)
            return null;
        return this.mapRowToBenefitType(result.rows[0]);
    }
    static async delete(id) {
        const result = await database_1.default.query('DELETE FROM benefit_types WHERE id = $1', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
    static async hasRelatedData(id) {
        const details = [];
        // Check beneficiaries
        const beneficiariesResult = await database_1.default.query('SELECT COUNT(*) as count FROM beneficiaries WHERE benefit_type_id = $1', [id]);
        const beneficiariesCount = parseInt(beneficiariesResult.rows[0].count, 10);
        if (beneficiariesCount > 0) {
            details.push(`льготников: ${beneficiariesCount}`);
        }
        // Check benefit_assignments
        const assignmentsResult = await database_1.default.query('SELECT COUNT(*) as count FROM benefit_assignments WHERE benefit_type_id = $1', [id]);
        const assignmentsCount = parseInt(assignmentsResult.rows[0].count, 10);
        if (assignmentsCount > 0) {
            details.push(`назначений льгот: ${assignmentsCount}`);
        }
        // Check calculation_tasks
        const tasksResult = await database_1.default.query('SELECT COUNT(*) as count FROM calculation_tasks WHERE benefit_type_id = $1', [id]);
        const tasksCount = parseInt(tasksResult.rows[0].count, 10);
        if (tasksCount > 0) {
            details.push(`задач расчёта: ${tasksCount}`);
        }
        return {
            hasData: details.length > 0,
            details,
        };
    }
    static mapRowToBenefitType(row) {
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
exports.BenefitTypeModel = BenefitTypeModel;
//# sourceMappingURL=BenefitType.js.map