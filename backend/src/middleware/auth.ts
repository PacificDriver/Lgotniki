import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    const decoded = jwt.verify(token, secret) as { userId: string };
    const user = await UserModel.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Пользователь не найден или неактивен' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется аутентификация' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Недостаточно прав' });
    }

    next();
  };
};


