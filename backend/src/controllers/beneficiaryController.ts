import { Response } from 'express';
import { BeneficiaryModel } from '../models/Beneficiary';
import { AuthRequest } from '../middleware/auth';
import { BeneficiaryStatus, OperationType } from '../types';

export const createBeneficiary = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const data = {
      fullName: req.body.fullName,
      birthDate: new Date(req.body.birthDate),
      phone: req.body.phone,
      email: req.body.email,
      snils: req.body.snils,
      hashPan: req.body.hashPan,
      nfcId: req.body.nfcId,
      rfid: req.body.rfid,
      benefitTypeId: req.body.benefitTypeId,
      status: req.body.status || BeneficiaryStatus.ACTIVE,
      residence: req.body.residence,
    };

    const beneficiary = await BeneficiaryModel.create(data);

    // Log operation
    if (req.user) {
      await BeneficiaryModel.logOperation(
        beneficiary.id,
        OperationType.CREATED,
        req.user.id,
        req.user.fullName,
        { data }
      );
    }

    return res.status(201).json(beneficiary);
  } catch (error: any) {
    console.error('Create beneficiary error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Ошибка при создании льготника' });
  }
};

export const getBeneficiary = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const beneficiary = await BeneficiaryModel.findById(id);

    if (!beneficiary) {
      return res.status(404).json({ error: 'Льготник не найден' });
    }

    return res.json(beneficiary);
  } catch (error) {
    console.error('Get beneficiary error:', error);
    return res.status(500).json({ error: 'Ошибка при получении данных льготника' });
  }
};

export const listBeneficiaries = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { status, benefitTypeId, search, limit, offset } = req.query;

    const result = await BeneficiaryModel.findAll({
      status: status as BeneficiaryStatus,
      benefitTypeId: benefitTypeId as string,
      search: search as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    return res.json(result);
  } catch (error) {
    console.error('List beneficiaries error:', error);
    return res.status(500).json({ error: 'Ошибка при получении списка льготников' });
  }
};

export const updateBeneficiary = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const beneficiary = await BeneficiaryModel.findById(id);

    if (!beneficiary) {
      return res.status(404).json({ error: 'Льготник не найден' });
    }

    const updateData: any = {};
    if (req.body.fullName !== undefined) updateData.fullName = req.body.fullName;
    if (req.body.birthDate !== undefined) updateData.birthDate = new Date(req.body.birthDate);
    if (req.body.phone !== undefined) updateData.phone = req.body.phone;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.snils !== undefined) updateData.snils = req.body.snils;
    if (req.body.hashPan !== undefined) updateData.hashPan = req.body.hashPan;
    if (req.body.nfcId !== undefined) updateData.nfcId = req.body.nfcId;
    if (req.body.rfid !== undefined) updateData.rfid = req.body.rfid;
    if (req.body.benefitTypeId !== undefined) updateData.benefitTypeId = req.body.benefitTypeId;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.residence !== undefined) updateData.residence = req.body.residence;

    const updated = await BeneficiaryModel.update(id, updateData);

    // Log operation
    if (req.user) {
      const operationType = updateData.status && updateData.status !== beneficiary.status
        ? OperationType.STATUS_CHANGED
        : OperationType.UPDATED;

      await BeneficiaryModel.logOperation(
        id,
        operationType,
        req.user.id,
        req.user.fullName,
        { oldData: beneficiary, newData: updateData }
      );
    }

    return res.json(updated);
  } catch (error: any) {
    console.error('Update beneficiary error:', error);
    return res
      .status(500)
      .json({ error: error.message || 'Ошибка при обновлении льготника' });
  }
};

export const deleteBeneficiary = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const beneficiary = await BeneficiaryModel.findById(id);

    if (!beneficiary) {
      return res.status(404).json({ error: 'Льготник не найден' });
    }

    await BeneficiaryModel.delete(id);

    // Log operation
    if (req.user) {
      await BeneficiaryModel.logOperation(
        id,
        OperationType.DELETED,
        req.user.id,
        req.user.fullName,
        { beneficiary }
      );
    }

    return res.json({ message: 'Льготник удален' });
  } catch (error) {
    console.error('Delete beneficiary error:', error);
    return res.status(500).json({ error: 'Ошибка при удалении льготника' });
  }
};

export const getBeneficiaryOperations = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const operations = await BeneficiaryModel.getOperations(id);
    return res.json(operations);
  } catch (error) {
    console.error('Get beneficiary operations error:', error);
    return res.status(500).json({ error: 'Ошибка при получении истории операций' });
  }
};


