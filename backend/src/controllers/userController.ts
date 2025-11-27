import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/User';

export const getCurrentProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
  }

  return res.json(req.user);
};

export const updateCurrentProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
    }

    const { fullName, email, password } = req.body;

    if (!fullName && !email && !password) {
      return res.status(400).json({ error: 'Нет данных для обновления' });
    }

    const updatedUser = await UserModel.updateById(req.user.id, {
      fullName,
      email,
      password,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Не удалось обновить профиль' });
  }
};

export const listOperators = async (_req: AuthRequest, res: Response) => {
  try {
    const operators = await UserModel.listOperators();
    return res.json(operators);
  } catch (error) {
    console.error('List operators error:', error);
    return res.status(500).json({ error: 'Не удалось получить список операторов' });
  }
};

export const createOperator = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, fullName, password, isActive } = req.body;

    if (!username || !email || !fullName || !password) {
      return res.status(400).json({ error: 'username, email, fullName и password обязательны' });
    }

    const operator = await UserModel.create({
      username,
      email,
      fullName,
      password,
      role: 'operator',
      isActive,
    });

    return res.status(201).json(operator);
  } catch (error) {
    console.error('Create operator error:', error);
    return res.status(500).json({ error: 'Не удалось создать оператора' });
  }
};

export const updateOperator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, fullName, password, isActive } = req.body;

    const current = await UserModel.findById(id);
    if (!current) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (current.role !== 'operator') {
      return res.status(400).json({ error: 'Можно изменять только операторов' });
    }

    const updated = await UserModel.updateById(id, {
      email,
      fullName,
      password,
      isActive,
    });

    return res.json(updated);
  } catch (error) {
    console.error('Update operator error:', error);
    return res.status(500).json({ error: 'Не удалось обновить оператора' });
  }
};

export const deleteOperator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const current = await UserModel.findById(id);

    if (!current) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (current.role !== 'operator') {
      return res.status(400).json({ error: 'Можно удалять только операторов' });
    }

    await UserModel.deleteById(id);
    return res.status(204).send();
  } catch (error) {
    console.error('Delete operator error:', error);
    return res.status(500).json({ error: 'Не удалось удалить оператора' });
  }
};

