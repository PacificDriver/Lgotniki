import { Response } from 'express';
import { CalculationTaskModel } from '../models/CalculationTask';
import { BenefitCalculationService } from '../services/benefitCalculationService';
import { AuthRequest } from '../middleware/auth';
import { TaskStatus } from '../types';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
    }

    const data = {
      name: req.body.name,
      description: req.body.description,
      benefitTypeId: req.body.benefitTypeId,
      filters: req.body.filters || {},
      status: TaskStatus.PENDING,
      createdBy: req.user.id,
    };

    const task = await CalculationTaskModel.create(data);
    res.status(201).json(task);
  } catch (error: any) {
    console.error('Create task error:', error);
    res.status(500).json({ error: error.message || 'Ошибка при создании задачи' });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await CalculationTaskModel.findById(id);

    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Ошибка при получении задачи' });
  }
};

export const listTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, benefitTypeId, limit, offset } = req.query;

    const result = await CalculationTaskModel.findAll({
      status: status as TaskStatus,
      benefitTypeId: benefitTypeId as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    res.json(result);
  } catch (error) {
    console.error('List tasks error:', error);
    res.status(500).json({ error: 'Ошибка при получении списка задач' });
  }
};

export const executeTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Execute in background (in production, use a job queue)
    BenefitCalculationService.executeTask(id).catch((error) => {
      console.error('Task execution error:', error);
    });

    res.json({ message: 'Задача запущена' });
  } catch (error: any) {
    console.error('Execute task error:', error);
    res.status(500).json({ error: error.message || 'Ошибка при выполнении задачи' });
  }
};


