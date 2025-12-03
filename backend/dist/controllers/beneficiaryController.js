"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBeneficiaryOperations = exports.deleteBeneficiary = exports.updateBeneficiary = exports.listBeneficiaries = exports.getBeneficiary = exports.createBeneficiary = void 0;
const Beneficiary_1 = require("../models/Beneficiary");
const types_1 = require("../types");
const normalizeDateInput = (value) => {
    if (!value) {
        return null;
    }
    if (typeof value === 'string') {
        if (value.length === 10 && !value.includes('T')) {
            return new Date(`${value}T00:00:00Z`);
        }
        return new Date(value);
    }
    return new Date(value);
};
const createBeneficiary = async (req, res) => {
    try {
        const birthDate = normalizeDateInput(req.body.birthDate);
        if (!birthDate) {
            return res
                .status(400)
                .json({ error: 'Некорректная дата рождения. Укажите дату в формате ГГГГ-ММ-ДД.' });
        }
        const data = {
            fullName: req.body.fullName,
            birthDate,
            phone: req.body.phone,
            email: req.body.email,
            snils: req.body.snils,
            hashPan: req.body.hashPan,
            nfcId: req.body.nfcId,
            rfid: req.body.rfid,
            benefitTypeId: req.body.benefitTypeId,
            status: req.body.status || types_1.BeneficiaryStatus.ACTIVE,
            residence: req.body.residence,
        };
        const beneficiary = await Beneficiary_1.BeneficiaryModel.create(data);
        // Log operation
        if (req.user) {
            await Beneficiary_1.BeneficiaryModel.logOperation(beneficiary.id, types_1.OperationType.CREATED, req.user.id, req.user.fullName, { data });
        }
        return res.status(201).json(beneficiary);
    }
    catch (error) {
        console.error('Create beneficiary error:', error);
        return res
            .status(500)
            .json({ error: error.message || 'Ошибка при создании льготника' });
    }
};
exports.createBeneficiary = createBeneficiary;
const getBeneficiary = async (req, res) => {
    try {
        const { id } = req.params;
        const beneficiary = await Beneficiary_1.BeneficiaryModel.findById(id);
        if (!beneficiary) {
            return res.status(404).json({ error: 'Льготник не найден' });
        }
        return res.json(beneficiary);
    }
    catch (error) {
        console.error('Get beneficiary error:', error);
        return res.status(500).json({ error: 'Ошибка при получении данных льготника' });
    }
};
exports.getBeneficiary = getBeneficiary;
const listBeneficiaries = async (req, res) => {
    try {
        const { status, benefitTypeId, search, limit, offset } = req.query;
        const filters = {};
        if (status && status !== '' && status !== 'undefined') {
            filters.status = status;
        }
        if (benefitTypeId && benefitTypeId !== '' && benefitTypeId !== 'undefined') {
            filters.benefitTypeId = benefitTypeId;
        }
        if (search && search !== '' && search !== 'undefined') {
            filters.search = search;
        }
        if (limit) {
            filters.limit = parseInt(limit);
        }
        if (offset) {
            filters.offset = parseInt(offset);
        }
        const result = await Beneficiary_1.BeneficiaryModel.findAll(filters);
        return res.json(result);
    }
    catch (error) {
        console.error('List beneficiaries error:', error);
        return res.status(500).json({ error: 'Ошибка при получении списка льготников' });
    }
};
exports.listBeneficiaries = listBeneficiaries;
const updateBeneficiary = async (req, res) => {
    try {
        const { id } = req.params;
        const beneficiary = await Beneficiary_1.BeneficiaryModel.findById(id);
        if (!beneficiary) {
            return res.status(404).json({ error: 'Льготник не найден' });
        }
        const updateData = {};
        if (req.body.fullName !== undefined)
            updateData.fullName = req.body.fullName;
        if (req.body.birthDate !== undefined) {
            const normalizedBirthDate = normalizeDateInput(req.body.birthDate);
            if (!normalizedBirthDate) {
                return res
                    .status(400)
                    .json({ error: 'Некорректная дата рождения. Укажите дату в формате ГГГГ-ММ-ДД.' });
            }
            updateData.birthDate = normalizedBirthDate;
        }
        if (req.body.phone !== undefined)
            updateData.phone = req.body.phone;
        if (req.body.email !== undefined)
            updateData.email = req.body.email;
        if (req.body.snils !== undefined)
            updateData.snils = req.body.snils;
        if (req.body.hashPan !== undefined)
            updateData.hashPan = req.body.hashPan;
        if (req.body.nfcId !== undefined)
            updateData.nfcId = req.body.nfcId;
        if (req.body.rfid !== undefined)
            updateData.rfid = req.body.rfid;
        if (req.body.benefitTypeId !== undefined)
            updateData.benefitTypeId = req.body.benefitTypeId;
        if (req.body.status !== undefined)
            updateData.status = req.body.status;
        if (req.body.residence !== undefined)
            updateData.residence = req.body.residence;
        const updated = await Beneficiary_1.BeneficiaryModel.update(id, updateData);
        // Log operation
        if (req.user) {
            const operationType = updateData.status && updateData.status !== beneficiary.status
                ? types_1.OperationType.STATUS_CHANGED
                : types_1.OperationType.UPDATED;
            await Beneficiary_1.BeneficiaryModel.logOperation(id, operationType, req.user.id, req.user.fullName, { oldData: beneficiary, newData: updateData });
        }
        return res.json(updated);
    }
    catch (error) {
        console.error('Update beneficiary error:', error);
        return res
            .status(500)
            .json({ error: error.message || 'Ошибка при обновлении льготника' });
    }
};
exports.updateBeneficiary = updateBeneficiary;
const deleteBeneficiary = async (req, res) => {
    try {
        const { id } = req.params;
        const beneficiary = await Beneficiary_1.BeneficiaryModel.findById(id);
        if (!beneficiary) {
            return res.status(404).json({ error: 'Льготник не найден' });
        }
        await Beneficiary_1.BeneficiaryModel.delete(id);
        // Log operation
        if (req.user) {
            await Beneficiary_1.BeneficiaryModel.logOperation(id, types_1.OperationType.DELETED, req.user.id, req.user.fullName, { beneficiary });
        }
        return res.json({ message: 'Льготник удален' });
    }
    catch (error) {
        console.error('Delete beneficiary error:', error);
        return res.status(500).json({ error: 'Ошибка при удалении льготника' });
    }
};
exports.deleteBeneficiary = deleteBeneficiary;
const getBeneficiaryOperations = async (req, res) => {
    try {
        const { id } = req.params;
        const operations = await Beneficiary_1.BeneficiaryModel.getOperations(id);
        return res.json(operations);
    }
    catch (error) {
        console.error('Get beneficiary operations error:', error);
        return res.status(500).json({ error: 'Ошибка при получении истории операций' });
    }
};
exports.getBeneficiaryOperations = getBeneficiaryOperations;
//# sourceMappingURL=beneficiaryController.js.map