import * as XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';
import { LoadMode, BeneficiaryStatus, OperationType } from '../types';
import { BeneficiaryModel } from '../models/Beneficiary';

interface UploadResult {
  total: number;
  created: number;
  updated: number;
  errors: Array<{ row: number; error: string }>;
}

export class FileUploadService {
  static async parseFile(filePath: string, fileType: string): Promise<any[]> {
    if (fileType === 'text/csv' || filePath.endsWith('.csv')) {
      const content = await fs.readFile(filePath, 'utf-8');
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
      return records;
    } else if (
      fileType.includes('spreadsheet') ||
      filePath.endsWith('.xlsx') ||
      filePath.endsWith('.xls')
    ) {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const records = XLSX.utils.sheet_to_json(worksheet);
      return records;
    }

    throw new Error('Неподдерживаемый формат файла');
  }

  static async processUpload(
    records: any[],
    loadMode: LoadMode,
    userId: string,
    userName: string
  ): Promise<UploadResult> {
    const result: UploadResult = {
      total: records.length,
      created: 0,
      updated: 0,
      errors: [],
    };

    // Map column names (flexible mapping)
    const mapRecord = (record: any) => {
      const mapped: any = {};
      
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
      mapped.status = record['Статус'] || record['status'] || BeneficiaryStatus.ACTIVE;

      return mapped;
    };

    const existingBeneficiaries = new Map<string, any>();

    // Load existing beneficiaries by phone for quick lookup
    if (loadMode !== LoadMode.ONLY_NEW) {
      const all = await BeneficiaryModel.findAll({});
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
          case LoadMode.FULL_SYNC:
            if (existing) {
              await BeneficiaryModel.update(existing.id, {
                ...record,
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                existing.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.updated++;
            } else {
              const newBeneficiary = await BeneficiaryModel.create({
                ...record,
                birthDate: new Date(record.birthDate),
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                newBeneficiary.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.created++;
            }
            break;

          case LoadMode.SOFT_ADD:
            if (existing) {
              await BeneficiaryModel.update(existing.id, {
                ...record,
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                existing.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.updated++;
            } else {
              const newBeneficiary = await BeneficiaryModel.create({
                ...record,
                birthDate: new Date(record.birthDate),
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                newBeneficiary.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.created++;
            }
            break;

          case LoadMode.ONLY_NEW:
            if (!existing) {
              const newBeneficiary = await BeneficiaryModel.create({
                ...record,
                birthDate: new Date(record.birthDate),
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                newBeneficiary.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.created++;
            }
            break;

          case LoadMode.ONLY_UPDATE:
            if (existing) {
              await BeneficiaryModel.update(existing.id, {
                ...record,
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                existing.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.updated++;
            }
            break;

          case LoadMode.FULL_RELOAD:
            // Deactivate all existing first (only once)
            if (i === 0) {
              const all = await BeneficiaryModel.findAll({});
              for (const b of all.beneficiaries) {
                await BeneficiaryModel.update(b.id, {
                  status: BeneficiaryStatus.INACTIVE,
                });
              }
            }
            // Create new
            const newBeneficiary = await BeneficiaryModel.create({
              ...record,
              birthDate: new Date(record.birthDate),
              lastLoadedAt: new Date(),
            });
            await BeneficiaryModel.logOperation(
              newBeneficiary.id,
              OperationType.LOADED,
              userId,
              userName,
              { source: 'file_upload', loadMode }
            );
            result.created++;
            break;

          case LoadMode.WITH_ARCHIVE:
            if (existing) {
              await BeneficiaryModel.update(existing.id, {
                ...record,
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                existing.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.updated++;
            } else {
              const newBeneficiary = await BeneficiaryModel.create({
                ...record,
                birthDate: new Date(record.birthDate),
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                newBeneficiary.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.created++;
            }
            // Archive missing ones (done after processing all)
            break;

          case LoadMode.WITH_MANUAL_REVIEW:
            if (existing) {
              await BeneficiaryModel.update(existing.id, {
                ...record,
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                existing.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.updated++;
            } else {
              const newBeneficiary = await BeneficiaryModel.create({
                ...record,
                birthDate: new Date(record.birthDate),
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                newBeneficiary.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.created++;
            }
            break;

          case LoadMode.WITH_DELAYED_DEACTIVATION:
            if (existing) {
              await BeneficiaryModel.update(existing.id, {
                ...record,
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                existing.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.updated++;
            } else {
              const newBeneficiary = await BeneficiaryModel.create({
                ...record,
                birthDate: new Date(record.birthDate),
                lastLoadedAt: new Date(),
              });
              await BeneficiaryModel.logOperation(
                newBeneficiary.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.created++;
            }
            break;

          case LoadMode.BY_LOAD_COUNTER:
            if (existing) {
              // Reset counter if found in file
              await BeneficiaryModel.update(existing.id, {
                ...record,
                lastLoadedAt: new Date(),
                loadCounter: 0,
              });
              await BeneficiaryModel.logOperation(
                existing.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.updated++;
            } else {
              const newBeneficiary = await BeneficiaryModel.create({
                ...record,
                birthDate: new Date(record.birthDate),
                lastLoadedAt: new Date(),
                loadCounter: 0,
              });
              await BeneficiaryModel.logOperation(
                newBeneficiary.id,
                OperationType.LOADED,
                userId,
                userName,
                { source: 'file_upload', loadMode }
              );
              result.created++;
            }
            break;
        }
      } catch (error: any) {
        result.errors.push({
          row: i + 2,
          error: error.message || 'Ошибка обработки строки',
        });
      }
    }

    // Post-processing for certain modes
    if (
      loadMode === LoadMode.FULL_SYNC ||
      loadMode === LoadMode.WITH_ARCHIVE ||
      loadMode === LoadMode.BY_LOAD_COUNTER ||
      loadMode === LoadMode.WITH_MANUAL_REVIEW ||
      loadMode === LoadMode.WITH_DELAYED_DEACTIVATION
    ) {
      const all = await BeneficiaryModel.findAll({});
      const filePhones = new Set(records.map((r) => mapRecord(r).phone).filter(Boolean));
      
      for (const beneficiary of all.beneficiaries) {
        if (!filePhones.has(beneficiary.phone)) {
          if (loadMode === LoadMode.FULL_SYNC) {
            await BeneficiaryModel.update(beneficiary.id, {
              status: BeneficiaryStatus.INACTIVE,
            });
          } else if (loadMode === LoadMode.WITH_ARCHIVE) {
            await BeneficiaryModel.update(beneficiary.id, {
              status: BeneficiaryStatus.ARCHIVE,
            });
          } else if (loadMode === LoadMode.WITH_MANUAL_REVIEW) {
            await BeneficiaryModel.update(beneficiary.id, {
              status: BeneficiaryStatus.UNDER_REVIEW,
            });
            await BeneficiaryModel.logOperation(
              beneficiary.id,
              OperationType.STATUS_CHANGED,
              userId,
              userName,
              { source: 'file_upload', loadMode, reason: 'Отсутствует в файле' }
            );
          } else if (loadMode === LoadMode.WITH_DELAYED_DEACTIVATION) {
            await BeneficiaryModel.update(beneficiary.id, {
              status: BeneficiaryStatus.POSSIBLY_LOST,
            });
            await BeneficiaryModel.logOperation(
              beneficiary.id,
              OperationType.STATUS_CHANGED,
              userId,
              userName,
              { source: 'file_upload', loadMode, reason: 'Возможно утратил льготу' }
            );
          } else if (loadMode === LoadMode.BY_LOAD_COUNTER) {
            // Increment load counter for beneficiaries not in file
            const newCounter = (beneficiary.loadCounter || 0) + 1;
            // Deactivate if counter reaches threshold (default: 3)
            const threshold = 3; // Can be made configurable
            if (newCounter >= threshold) {
              await BeneficiaryModel.update(beneficiary.id, {
                status: BeneficiaryStatus.INACTIVE,
                loadCounter: newCounter,
              });
              await BeneficiaryModel.logOperation(
                beneficiary.id,
                OperationType.STATUS_CHANGED,
                userId,
                userName,
                { source: 'file_upload', loadMode, reason: `Счетчик достиг ${threshold}` }
              );
            } else {
              await BeneficiaryModel.update(beneficiary.id, {
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


