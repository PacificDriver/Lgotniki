"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBenefitType = exports.updateBenefitType = exports.listBenefitTypes = exports.getBenefitType = exports.createBenefitType = void 0;
const BenefitType_1 = require("../models/BenefitType");
const createBenefitType = async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            description: req.body.description,
            routes: req.body.routes || [],
            settlements: req.body.settlements || [],
            timeRestrictions: req.body.timeRestrictions,
            calculationType: req.body.calculationType,
            calculationParams: req.body.calculationParams,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        };
        const benefitType = await BenefitType_1.BenefitTypeModel.create(data);
        return res.status(201).json(benefitType);
    }
    catch (error) {
        console.error('Create benefit type error:', error);
        return res
            .status(500)
            .json({ error: error.message || 'Ошибка при создании типа льготы' });
    }
};
exports.createBenefitType = createBenefitType;
const getBenefitType = async (req, res) => {
    try {
        const { id } = req.params;
        const benefitType = await BenefitType_1.BenefitTypeModel.findById(id);
        if (!benefitType) {
            return res.status(404).json({ error: 'Тип льготы не найден' });
        }
        return res.json(benefitType);
    }
    catch (error) {
        console.error('Get benefit type error:', error);
        return res.status(500).json({ error: 'Ошибка при получении типа льготы' });
    }
};
exports.getBenefitType = getBenefitType;
const listBenefitTypes = async (req, res) => {
    try {
        const activeOnly = req.query.activeOnly === 'true';
        const benefitTypes = await BenefitType_1.BenefitTypeModel.findAll(activeOnly);
        return res.json(benefitTypes);
    }
    catch (error) {
        console.error('List benefit types error:', error);
        return res.status(500).json({ error: 'Ошибка при получении списка типов льгот' });
    }
};
exports.listBenefitTypes = listBenefitTypes;
const updateBenefitType = async (req, res) => {
    try {
        const { id } = req.params;
        const benefitType = await BenefitType_1.BenefitTypeModel.findById(id);
        if (!benefitType) {
            return res.status(404).json({ error: 'Тип льготы не найден' });
        }
        const updateData = {};
        if (req.body.name !== undefined)
            updateData.name = req.body.name;
        if (req.body.description !== undefined)
            updateData.description = req.body.description;
        if (req.body.routes !== undefined)
            updateData.routes = req.body.routes;
        if (req.body.settlements !== undefined)
            updateData.settlements = req.body.settlements;
        if (req.body.timeRestrictions !== undefined)
            updateData.timeRestrictions = req.body.timeRestrictions;
        if (req.body.calculationType !== undefined)
            updateData.calculationType = req.body.calculationType;
        if (req.body.calculationParams !== undefined)
            updateData.calculationParams = req.body.calculationParams;
        if (req.body.isActive !== undefined)
            updateData.isActive = req.body.isActive;
        const updated = await BenefitType_1.BenefitTypeModel.update(id, updateData);
        return res.json(updated);
    }
    catch (error) {
        console.error('Update benefit type error:', error);
        return res
            .status(500)
            .json({ error: error.message || 'Ошибка при обновлении типа льготы' });
    }
};
exports.updateBenefitType = updateBenefitType;
const deleteBenefitType = async (req, res) => {
    try {
        const { id } = req.params;
        const benefitType = await BenefitType_1.BenefitTypeModel.findById(id);
        if (!benefitType) {
            return res.status(404).json({ error: 'Тип льготы не найден' });
        }
        // Check for related data
        const relatedData = await BenefitType_1.BenefitTypeModel.hasRelatedData(id);
        if (relatedData.hasData) {
            return res.status(409).json({
                error: `Невозможно удалить тип льготы. Есть связанные данные: ${relatedData.details.join(', ')}`,
            });
        }
        const deleted = await BenefitType_1.BenefitTypeModel.delete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Тип льготы не найден' });
        }
        return res.json({ message: 'Тип льготы удален' });
    }
    catch (error) {
        console.error('Delete benefit type error:', error);
        return res.status(500).json({ error: 'Ошибка при удалении типа льготы' });
    }
};
exports.deleteBenefitType = deleteBenefitType;
//# sourceMappingURL=benefitTypeController.js.map