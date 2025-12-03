"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
        }
        const user = await User_1.UserModel.findByUsername(username);
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
        }
        const isValid = await User_1.UserModel.verifyPassword(user, password);
        if (!isValid) {
            return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
        }
        const secretEnv = process.env.JWT_SECRET;
        if (!secretEnv) {
            console.error('JWT secret is not configured');
            return res.status(500).json({ error: 'Конфигурация JWT отсутствует' });
        }
        const secret = secretEnv;
        const expiresIn = (process.env.JWT_EXPIRES_IN || '7d');
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret, { expiresIn });
        return res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Ошибка при входе в систему' });
    }
};
exports.login = login;
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
        }
        const user = await User_1.UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        return res.json(user);
    }
    catch (error) {
        console.error('Get current user error:', error);
        return res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=authController.js.map