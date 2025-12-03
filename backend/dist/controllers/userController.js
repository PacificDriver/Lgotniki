"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOperator = exports.updateOperator = exports.createOperator = exports.listOperators = exports.updateCurrentProfile = exports.getCurrentProfile = void 0;
const User_1 = require("../models/User");
const getCurrentProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
    }
    return res.json(req.user);
};
exports.getCurrentProfile = getCurrentProfile;
const updateCurrentProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
        }
        const { fullName, email, password } = req.body;
        if (!fullName && !email && !password) {
            return res.status(400).json({ error: 'Нет данных для обновления' });
        }
        const updatedUser = await User_1.UserModel.updateById(req.user.id, {
            fullName,
            email,
            password,
        });
        if (!updatedUser) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        return res.json(updatedUser);
    }
    catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ error: 'Не удалось обновить профиль' });
    }
};
exports.updateCurrentProfile = updateCurrentProfile;
const listOperators = async (_req, res) => {
    try {
        const operators = await User_1.UserModel.listOperators();
        return res.json(operators);
    }
    catch (error) {
        console.error('List operators error:', error);
        return res.status(500).json({ error: 'Не удалось получить список операторов' });
    }
};
exports.listOperators = listOperators;
const createOperator = async (req, res) => {
    try {
        const { username, email, fullName, password, isActive } = req.body;
        if (!username || !email || !fullName || !password) {
            return res.status(400).json({ error: 'username, email, fullName и password обязательны' });
        }
        const operator = await User_1.UserModel.create({
            username,
            email,
            fullName,
            password,
            role: 'operator',
            isActive,
        });
        return res.status(201).json(operator);
    }
    catch (error) {
        console.error('Create operator error:', error);
        return res.status(500).json({ error: 'Не удалось создать оператора' });
    }
};
exports.createOperator = createOperator;
const updateOperator = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, fullName, password, isActive } = req.body;
        const current = await User_1.UserModel.findById(id);
        if (!current) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        if (current.role !== 'operator') {
            return res.status(400).json({ error: 'Можно изменять только операторов' });
        }
        const updated = await User_1.UserModel.updateById(id, {
            email,
            fullName,
            password,
            isActive,
        });
        return res.json(updated);
    }
    catch (error) {
        console.error('Update operator error:', error);
        return res.status(500).json({ error: 'Не удалось обновить оператора' });
    }
};
exports.updateOperator = updateOperator;
const deleteOperator = async (req, res) => {
    try {
        const { id } = req.params;
        const current = await User_1.UserModel.findById(id);
        if (!current) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        if (current.role !== 'operator') {
            return res.status(400).json({ error: 'Можно удалять только операторов' });
        }
        await User_1.UserModel.deleteById(id);
        return res.status(204).send();
    }
    catch (error) {
        console.error('Delete operator error:', error);
        return res.status(500).json({ error: 'Не удалось удалить оператора' });
    }
};
exports.deleteOperator = deleteOperator;
//# sourceMappingURL=userController.js.map