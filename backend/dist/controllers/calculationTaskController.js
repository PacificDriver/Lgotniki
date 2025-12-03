"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTask = exports.listTasks = exports.getTask = exports.createTask = void 0;
const CalculationTask_1 = require("../models/CalculationTask");
const benefitCalculationService_1 = require("../services/benefitCalculationService");
const types_1 = require("../types");
const createTask = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
        }
        const data = {
            name: req.body.name,
            description: req.body.description,
            benefitTypeId: req.body.benefitTypeId,
            filters: req.body.filters || {},
            status: types_1.TaskStatus.PENDING,
            createdBy: req.user.id,
        };
        const task = await CalculationTask_1.CalculationTaskModel.create(data);
        return res.status(201).json(task);
    }
    catch (error) {
        console.error('Create task error:', error);
        return res.status(500).json({ error: error.message || 'Ошибка при создании задачи' });
    }
};
exports.createTask = createTask;
const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await CalculationTask_1.CalculationTaskModel.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Задача не найдена' });
        }
        return res.json(task);
    }
    catch (error) {
        console.error('Get task error:', error);
        return res.status(500).json({ error: 'Ошибка при получении задачи' });
    }
};
exports.getTask = getTask;
const listTasks = async (req, res) => {
    try {
        const { status, benefitTypeId, limit, offset } = req.query;
        const result = await CalculationTask_1.CalculationTaskModel.findAll({
            status: status,
            benefitTypeId: benefitTypeId,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
        });
        return res.json(result);
    }
    catch (error) {
        console.error('List tasks error:', error);
        return res.status(500).json({ error: 'Ошибка при получении списка задач' });
    }
};
exports.listTasks = listTasks;
const executeTask = async (req, res) => {
    try {
        const { id } = req.params;
        // Execute in background (in production, use a job queue)
        benefitCalculationService_1.BenefitCalculationService.executeTask(id).catch((error) => {
            console.error('Task execution error:', error);
        });
        return res.json({ message: 'Задача запущена' });
    }
    catch (error) {
        console.error('Execute task error:', error);
        return res.status(500).json({ error: error.message || 'Ошибка при выполнении задачи' });
    }
};
exports.executeTask = executeTask;
//# sourceMappingURL=calculationTaskController.js.map