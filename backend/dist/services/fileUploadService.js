"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const XLSX = __importStar(require("xlsx"));
const sync_1 = require("csv-parse/sync");
const promises_1 = __importDefault(require("fs/promises"));
const types_1 = require("../types");
const Beneficiary_1 = require("../models/Beneficiary");
class FileUploadService {
    static async parseFile(filePath, fileType) {
        if (fileType === 'text/csv' || filePath.endsWith('.csv')) {
            const content = await promises_1.default.readFile(filePath, 'utf-8');
            const records = (0, sync_1.parse)(content, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
            });
            return records;
        }
        else if (fileType.includes('spreadsheet') ||
            filePath.endsWith('.xlsx') ||
            filePath.endsWith('.xls')) {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const records = XLSX.utils.sheet_to_json(worksheet);
            return records;
        }
        throw new Error('Неподдерживаемый формат файла');
    }
    static async processUpload(records, loadMode, userId, userName) {
        const result = {
            total: records.length,
            created: 0,
            updated: 0,
            errors: [],
        };
        // Map column names (flexible mapping)
        const mapRecord = (record) => {
            const mapped = {};
            // Try different possible column names
            mapped.fullName = record['ФИО'] || record['ФИО льготника'] || record['fullName'] || record['name'];
            mapped.birthDate = record['Дата рождения'] || record['birthDate'] || record['birth_date'];
            mapped.phone = record['Телефон'] || record['phone'] || record['Phone'];
            mapped.email = record['Email'] || record['email'] || record['Электронная почта'];
            mapped.snils = record['СНИЛС'] || record['snils'] || record['SNILS'];
            mapped.hashPan = record['Hash-PAN'] || record['hashPan'] || record['hash_pan'];
            mapped.nfcId = record['NFC ID'] || record['nfcId'] || record['nfc_id'];
            mapped.rfid = record['RFID'] || record['rfid'];
            mapped.residence = record['Место жительства'] || record['residence'] || record['Место жительства'];
            mapped.status = record['Статус'] || record['status'] || types_1.BeneficiaryStatus.ACTIVE;
            return mapped;
        };
        const existingBeneficiaries = new Map();
        // Load existing beneficiaries by phone for quick lookup
        if (loadMode !== types_1.LoadMode.ONLY_NEW) {
            const all = await Beneficiary_1.BeneficiaryModel.findAll({});
            all.beneficiaries.forEach((b) => {
                existingBeneficiaries.set(b.phone, b);
            });
        }
        for (let i = 0; i < records.length; i++) {
            try {
                const record = mapRecord(records[i]);
                if (!record.fullName || !record.birthDate || !record.phone) {
                    result.errors.push({
                        row: i + 2, // +2 because of header and 0-index
                        error: 'Отсутствуют обязательные поля (ФИО, Дата рождения, Телефон)',
                    });
                    continue;
                }
                const existing = existingBeneficiaries.get(record.phone);
                switch (loadMode) {
                    case types_1.LoadMode.FULL_SYNC:
                        if (existing) {
                            await Beneficiary_1.BeneficiaryModel.update(existing.id, {
                                ...record,
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(existing.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.updated++;
                        }
                        else {
                            const newBeneficiary = await Beneficiary_1.BeneficiaryModel.create({
                                ...record,
                                birthDate: new Date(record.birthDate),
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(newBeneficiary.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.created++;
                        }
                        break;
                    case types_1.LoadMode.SOFT_ADD:
                        if (existing) {
                            await Beneficiary_1.BeneficiaryModel.update(existing.id, {
                                ...record,
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(existing.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.updated++;
                        }
                        else {
                            const newBeneficiary = await Beneficiary_1.BeneficiaryModel.create({
                                ...record,
                                birthDate: new Date(record.birthDate),
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(newBeneficiary.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.created++;
                        }
                        break;
                    case types_1.LoadMode.ONLY_NEW:
                        if (!existing) {
                            const newBeneficiary = await Beneficiary_1.BeneficiaryModel.create({
                                ...record,
                                birthDate: new Date(record.birthDate),
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(newBeneficiary.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.created++;
                        }
                        break;
                    case types_1.LoadMode.ONLY_UPDATE:
                        if (existing) {
                            await Beneficiary_1.BeneficiaryModel.update(existing.id, {
                                ...record,
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(existing.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.updated++;
                        }
                        break;
                    case types_1.LoadMode.FULL_RELOAD:
                        // Deactivate all existing first (only once)
                        if (i === 0) {
                            const all = await Beneficiary_1.BeneficiaryModel.findAll({});
                            for (const b of all.beneficiaries) {
                                await Beneficiary_1.BeneficiaryModel.update(b.id, {
                                    status: types_1.BeneficiaryStatus.INACTIVE,
                                });
                            }
                        }
                        // Create new
                        const newBeneficiary = await Beneficiary_1.BeneficiaryModel.create({
                            ...record,
                            birthDate: new Date(record.birthDate),
                            lastLoadedAt: new Date(),
                        });
                        await Beneficiary_1.BeneficiaryModel.logOperation(newBeneficiary.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                        result.created++;
                        break;
                    case types_1.LoadMode.WITH_ARCHIVE:
                        if (existing) {
                            await Beneficiary_1.BeneficiaryModel.update(existing.id, {
                                ...record,
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(existing.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.updated++;
                        }
                        else {
                            const newBeneficiary = await Beneficiary_1.BeneficiaryModel.create({
                                ...record,
                                birthDate: new Date(record.birthDate),
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(newBeneficiary.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.created++;
                        }
                        // Archive missing ones (done after processing all)
                        break;
                    case types_1.LoadMode.WITH_MANUAL_REVIEW:
                        if (existing) {
                            await Beneficiary_1.BeneficiaryModel.update(existing.id, {
                                ...record,
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(existing.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.updated++;
                        }
                        else {
                            const newBeneficiary = await Beneficiary_1.BeneficiaryModel.create({
                                ...record,
                                birthDate: new Date(record.birthDate),
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(newBeneficiary.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.created++;
                        }
                        break;
                    case types_1.LoadMode.WITH_DELAYED_DEACTIVATION:
                        if (existing) {
                            await Beneficiary_1.BeneficiaryModel.update(existing.id, {
                                ...record,
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(existing.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.updated++;
                        }
                        else {
                            const newBeneficiary = await Beneficiary_1.BeneficiaryModel.create({
                                ...record,
                                birthDate: new Date(record.birthDate),
                                lastLoadedAt: new Date(),
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(newBeneficiary.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.created++;
                        }
                        break;
                    case types_1.LoadMode.BY_LOAD_COUNTER:
                        if (existing) {
                            // Reset counter if found in file
                            await Beneficiary_1.BeneficiaryModel.update(existing.id, {
                                ...record,
                                lastLoadedAt: new Date(),
                                loadCounter: 0,
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(existing.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.updated++;
                        }
                        else {
                            const newBeneficiary = await Beneficiary_1.BeneficiaryModel.create({
                                ...record,
                                birthDate: new Date(record.birthDate),
                                lastLoadedAt: new Date(),
                                loadCounter: 0,
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(newBeneficiary.id, types_1.OperationType.LOADED, userId, userName, { source: 'file_upload', loadMode });
                            result.created++;
                        }
                        break;
                }
            }
            catch (error) {
                result.errors.push({
                    row: i + 2,
                    error: error.message || 'Ошибка обработки строки',
                });
            }
        }
        // Post-processing for certain modes
        if (loadMode === types_1.LoadMode.FULL_SYNC ||
            loadMode === types_1.LoadMode.WITH_ARCHIVE ||
            loadMode === types_1.LoadMode.BY_LOAD_COUNTER ||
            loadMode === types_1.LoadMode.WITH_MANUAL_REVIEW ||
            loadMode === types_1.LoadMode.WITH_DELAYED_DEACTIVATION) {
            const all = await Beneficiary_1.BeneficiaryModel.findAll({});
            const filePhones = new Set(records.map((r) => mapRecord(r).phone).filter(Boolean));
            for (const beneficiary of all.beneficiaries) {
                if (!filePhones.has(beneficiary.phone)) {
                    if (loadMode === types_1.LoadMode.FULL_SYNC) {
                        await Beneficiary_1.BeneficiaryModel.update(beneficiary.id, {
                            status: types_1.BeneficiaryStatus.INACTIVE,
                        });
                    }
                    else if (loadMode === types_1.LoadMode.WITH_ARCHIVE) {
                        await Beneficiary_1.BeneficiaryModel.update(beneficiary.id, {
                            status: types_1.BeneficiaryStatus.ARCHIVE,
                        });
                    }
                    else if (loadMode === types_1.LoadMode.WITH_MANUAL_REVIEW) {
                        await Beneficiary_1.BeneficiaryModel.update(beneficiary.id, {
                            status: types_1.BeneficiaryStatus.UNDER_REVIEW,
                        });
                        await Beneficiary_1.BeneficiaryModel.logOperation(beneficiary.id, types_1.OperationType.STATUS_CHANGED, userId, userName, { source: 'file_upload', loadMode, reason: 'Отсутствует в файле' });
                    }
                    else if (loadMode === types_1.LoadMode.WITH_DELAYED_DEACTIVATION) {
                        await Beneficiary_1.BeneficiaryModel.update(beneficiary.id, {
                            status: types_1.BeneficiaryStatus.POSSIBLY_LOST,
                        });
                        await Beneficiary_1.BeneficiaryModel.logOperation(beneficiary.id, types_1.OperationType.STATUS_CHANGED, userId, userName, { source: 'file_upload', loadMode, reason: 'Возможно утратил льготу' });
                    }
                    else if (loadMode === types_1.LoadMode.BY_LOAD_COUNTER) {
                        // Increment load counter for beneficiaries not in file
                        const newCounter = (beneficiary.loadCounter || 0) + 1;
                        // Deactivate if counter reaches threshold (default: 3)
                        const threshold = 3; // Can be made configurable
                        if (newCounter >= threshold) {
                            await Beneficiary_1.BeneficiaryModel.update(beneficiary.id, {
                                status: types_1.BeneficiaryStatus.INACTIVE,
                                loadCounter: newCounter,
                            });
                            await Beneficiary_1.BeneficiaryModel.logOperation(beneficiary.id, types_1.OperationType.STATUS_CHANGED, userId, userName, { source: 'file_upload', loadMode, reason: `Счетчик достиг ${threshold}` });
                        }
                        else {
                            await Beneficiary_1.BeneficiaryModel.update(beneficiary.id, {
                                loadCounter: newCounter,
                            });
                        }
                    }
                }
            }
        }
        return result;
    }
}
exports.FileUploadService = FileUploadService;
//# sourceMappingURL=fileUploadService.js.map