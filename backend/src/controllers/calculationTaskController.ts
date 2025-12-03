import { Response } from 'express';
import { CalculationTaskModel } from '../models/CalculationTask';
import { BenefitCalculationService } from '../services/benefitCalculationService';
import { AuthRequest } from '../middleware/auth';
import { TaskStatus } from '../types';

export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
    }

    // Validate required fields
    if (!req.body.name || !req.body.benefitTypeId) {
      return res.status(400).json({ 
        error: 'Необходимо указать название задачи и тип льготы' 
      });
    }

    const data = {
      name: req.body.name,
      description: req.body.description || null,
      benefitTypeId: req.body.benefitTypeId,
      filters: req.body.filters || {},
      status: TaskStatus.PENDING,
      createdBy: req.user.id,
    };

    console.log('Creating task with data:', JSON.stringify(data, null, 2));
    const task = await CalculationTaskModel.create(data);
    return res.status(201).json(task);
  } catch (error: any) {
    console.error('Create task error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ error: error.message || 'Ошибка при создании задачи' });
  }
};

export const getTask = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const task = await CalculationTaskModel.findById(id);

    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    return res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    return res.status(500).json({ error: 'Ошибка при получении задачи' });
  }
};

export const listTasks = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { status, benefitTypeId, limit, offset } = req.query;

    const result = await CalculationTaskModel.findAll({
      status: status as TaskStatus,
      benefitTypeId: benefitTypeId as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    return res.json(result);
  } catch (error) {
    console.error('List tasks error:', error);
    return res.status(500).json({ error: 'Ошибка при получении списка задач' });
  }
};

export const executeTask = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const conflictResolution = {
      action: req.body.conflictResolution || 'skip',
      deactivateExisting: req.body.deactivateExisting || false,
    };
    
    // Execute in background (in production, use a job queue)
    BenefitCalculationService.executeTask(id, conflictResolution).catch((error) => {
      console.error('Task execution error:', error);
    });

    return res.json({ message: 'Задача запущена' });
  } catch (error: any) {
    console.error('Execute task error:', error);
    return res.status(500).json({ error: error.message || 'Ошибка при выполнении задачи' });
  }
};


