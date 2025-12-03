"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BenefitCalculationService = void 0;
const Beneficiary_1 = require("../models/Beneficiary");
const BenefitType_1 = require("../models/BenefitType");
const BenefitAssignment_1 = require("../models/BenefitAssignment");
const CalculationTask_1 = require("../models/CalculationTask");
const types_1 = require("../types");
class BenefitCalculationService {
    static async executeTask(taskId) {
        const task = await CalculationTask_1.CalculationTaskModel.findById(taskId);
        if (!task) {
            throw new Error('Задача не найдена');
        }
        if (task.status !== types_1.TaskStatus.PENDING) {
            throw new Error('Задача уже выполнена или выполняется');
        }
        // Update task status
        await CalculationTask_1.CalculationTaskModel.update(taskId, {
            status: types_1.TaskStatus.IN_PROGRESS,
        });
        try {
            const benefitType = await BenefitType_1.BenefitTypeModel.findById(task.benefitTypeId);
            if (!benefitType || !benefitType.isActive) {
                throw new Error('Тип льготы не найден или неактивен');
            }
            // Get beneficiaries based on filters
            const filters = {};
            if (task.filters?.status)
                filters.status = task.filters.status;
            if (task.filters?.benefitTypeId)
                filters.benefitTypeId = task.filters.benefitTypeId;
            if (task.filters?.search)
                filters.search = task.filters.search;
            const { beneficiaries, total } = await Beneficiary_1.BeneficiaryModel.findAll(filters);
            await CalculationTask_1.CalculationTaskModel.update(taskId, {
                totalBeneficiaries: total,
            });
            let processed = 0;
            let errors = [];
            for (const beneficiary of beneficiaries) {
                try {
                    // Check if beneficiary already has this benefit type assigned
                    const existingAssignments = await BenefitAssignment_1.BenefitAssignmentModel.findByBeneficiary(beneficiary.id, true);
                    const hasActiveAssignment = existingAssignments.some((a) => a.benefitTypeId === task.benefitTypeId && a.isActive);
                    if (hasActiveAssignment) {
                        processed++;
                        continue; // Skip if already assigned
                    }
                    // Calculate benefit parameters based on type
                    let tripsRemaining;
                    let kilometersRemaining;
                    let discountPercent;
                    switch (benefitType.calculationType) {
                        case types_1.BenefitCalculationType.FIXED_TRIPS:
                            tripsRemaining = benefitType.calculationParams?.trips || 0;
                            break;
                        case types_1.BenefitCalculationType.KILOMETER_LIMIT:
                            kilometersRemaining = benefitType.calculationParams?.kilometers || 0;
                            break;
                        case types_1.BenefitCalculationType.DISCOUNT_PERCENT:
                            discountPercent = benefitType.calculationParams?.discountPercent || 0;
                            break;
                        case types_1.BenefitCalculationType.FREE:
                            // No specific parameters needed
                            break;
                    }
                    // Create benefit assignment
                    await BenefitAssignment_1.BenefitAssignmentModel.create({
                        beneficiaryId: beneficiary.id,
                        benefitTypeId: task.benefitTypeId,
                        tripsRemaining,
                        kilometersRemaining,
                        discountPercent,
                        validFrom: new Date(),
                        isActive: true,
                    });
                    // Log operation
                    await Beneficiary_1.BeneficiaryModel.logOperation(beneficiary.id, types_1.OperationType.BENEFIT_ASSIGNED, task.createdBy, 'System', // Could be improved to get actual user name
                    {
                        benefitTypeId: task.benefitTypeId,
                        benefitTypeName: benefitType.name,
                        taskId,
                    });
                    processed++;
                }
                catch (error) {
                    errors.push(`Льготник ${beneficiary.id}: ${error.message}`);
                }
                // Update progress
                if (processed % 10 === 0) {
                    await CalculationTask_1.CalculationTaskModel.update(taskId, {
                        processedBeneficiaries: processed,
                    });
                }
            }
            // Complete task
            await CalculationTask_1.CalculationTaskModel.update(taskId, {
                status: types_1.TaskStatus.COMPLETED,
                processedBeneficiaries: processed,
                completedAt: new Date(),
                errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
            });
        }
        catch (error) {
            await CalculationTask_1.CalculationTaskModel.update(taskId, {
                status: types_1.TaskStatus.FAILED,
                errorMessage: error.message,
            });
            throw error;
        }
    }
}
exports.BenefitCalculationService = BenefitCalculationService;
//# sourceMappingURL=benefitCalculationService.js.map