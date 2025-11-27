import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
    }

    const user = await UserModel.findByUsername(username);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    const isValid = await UserModel.verifyPassword(user, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || '',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка при входе в систему' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Ошибка при получении данных пользователя' });
  }
};


