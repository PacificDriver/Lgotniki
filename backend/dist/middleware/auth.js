"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Токен не предоставлен' });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT secret is not configured');
            return res.status(500).json({ error: 'Конфигурация JWT отсутствует' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await User_1.UserModel.findById(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Пользователь не найден или неактивен' });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Недействительный токен' });
    }
};
exports.authenticate = authenticate;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Требуется аутентификация' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Недостаточно прав' });
        }
        return next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map