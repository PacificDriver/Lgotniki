import { Response } from 'express';
import { BenefitTypeModel } from '../models/BenefitType';
import { AuthRequest } from '../middleware/auth';

export const createBenefitType = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
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

    const benefitType = await BenefitTypeModel.create(data);
    return res.status(201).json(benefitType);
  } catch (error: any) {
    console.error('Create benefit type error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Ошибка при создании типа льготы' });
  }
};

export const getBenefitType = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const benefitType = await BenefitTypeModel.findById(id);

    if (!benefitType) {
      return res.status(404).json({ error: 'Тип льготы не найден' });
    }

    return res.json(benefitType);
  } catch (error) {
    console.error('Get benefit type error:', error);
    return res.status(500).json({ error: 'Ошибка при получении типа льготы' });
  }
};

export const listBenefitTypes = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const activeOnly = req.query.activeOnly === 'true';
    const benefitTypes = await BenefitTypeModel.findAll(activeOnly);
    return res.json(benefitTypes);
  } catch (error) {
    console.error('List benefit types error:', error);
    return res.status(500).json({ error: 'Ошибка при получении списка типов льгот' });
  }
};

export const updateBenefitType = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const benefitType = await BenefitTypeModel.findById(id);

    if (!benefitType) {
      return res.status(404).json({ error: 'Тип льготы не найден' });
    }

    const updateData: any = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.routes !== undefined) updateData.routes = req.body.routes;
    if (req.body.settlements !== undefined) updateData.settlements = req.body.settlements;
    if (req.body.timeRestrictions !== undefined) updateData.timeRestrictions = req.body.timeRestrictions;
    if (req.body.calculationType !== undefined) updateData.calculationType = req.body.calculationType;
    if (req.body.calculationParams !== undefined) updateData.calculationParams = req.body.calculationParams;
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;

    const updated = await BenefitTypeModel.update(id, updateData);
    return res.json(updated);
  } catch (error: any) {
    console.error('Update benefit type error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Ошибка при обновлении типа льготы' });
  }
};

export const checkRelatedData = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const benefitType = await BenefitTypeModel.findById(id);

    if (!benefitType) {
      return res.status(404).json({ error: 'Тип льготы не найден' });
    }

    const relatedData = await BenefitTypeModel.hasRelatedData(id);
    return res.json(relatedData);
  } catch (error) {
    console.error('Check related data error:', error);
    return res.status(500).json({ error: 'Ошибка при проверке связанных данных' });
  }
};

export const deleteBenefitType = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const benefitType = await BenefitTypeModel.findById(id);
    if (!benefitType) {
      return res.status(404).json({ error: 'Тип льготы не найден' });
    }

    // Check for related data
    const relatedData = await BenefitTypeModel.hasRelatedData(id);
    if (relatedData.hasData) {
      return res.status(409).json({
        error: `Невозможно удалить тип льготы. Есть связанные данные: ${relatedData.details.join(', ')}`,
      });
    }

    const deleted = await BenefitTypeModel.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Тип льготы не найден' });
    }

    return res.json({ message: 'Тип льготы удален' });
  } catch (error) {
    console.error('Delete benefit type error:', error);
    return res.status(500).json({ error: 'Ошибка при удалении типа льготы' });
  }
};


