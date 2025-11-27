import { BeneficiaryModel } from '../models/Beneficiary';
import { BenefitTypeModel } from '../models/BenefitType';
import { BenefitAssignmentModel } from '../models/BenefitAssignment';
import { CalculationTaskModel } from '../models/CalculationTask';
import { TaskStatus, BenefitCalculationType, OperationType } from '../types';

export class BenefitCalculationService {
  static async executeTask(taskId: string): Promise<void> {
    const task = await CalculationTaskModel.findById(taskId);
    if (!task) {
      throw new Error('Задача не найдена');
    }

    if (task.status !== TaskStatus.PENDING) {
      throw new Error('Задача уже выполнена или выполняется');
    }

    // Update task status
    await CalculationTaskModel.update(taskId, {
      status: TaskStatus.IN_PROGRESS,
    });

    try {
      const benefitType = await BenefitTypeModel.findById(task.benefitTypeId);
      if (!benefitType || !benefitType.isActive) {
        throw new Error('Тип льготы не найден или неактивен');
      }

      // Get beneficiaries based on filters
      const filters: any = {};
      if (task.filters?.status) filters.status = task.filters.status;
      if (task.filters?.benefitTypeId) filters.benefitTypeId = task.filters.benefitTypeId;
      if (task.filters?.search) filters.search = task.filters.search;

      const { beneficiaries, total } = await BeneficiaryModel.findAll(filters);
      
      await CalculationTaskModel.update(taskId, {
        totalBeneficiaries: total,
      });

      let processed = 0;
      let errors: string[] = [];

      for (const beneficiary of beneficiaries) {
        try {
          // Check if beneficiary already has this benefit type assigned
          const existingAssignments = await BenefitAssignmentModel.findByBeneficiary(
            beneficiary.id,
            true
          );

          const hasActiveAssignment = existingAssignments.some(
            (a) => a.benefitTypeId === task.benefitTypeId && a.isActive
          );

          if (hasActiveAssignment) {
            processed++;
            continue; // Skip if already assigned
          }

          // Calculate benefit parameters based on type
          let tripsRemaining: number | undefined;
          let kilometersRemaining: number | undefined;
          let discountPercent: number | undefined;

          switch (benefitType.calculationType) {
            case BenefitCalculationType.FIXED_TRIPS:
              tripsRemaining = benefitType.calculationParams?.trips || 0;
              break;

            case BenefitCalculationType.KILOMETER_LIMIT:
              kilometersRemaining = benefitType.calculationParams?.kilometers || 0;
              break;

            case BenefitCalculationType.DISCOUNT_PERCENT:
              discountPercent = benefitType.calculationParams?.discountPercent || 0;
              break;

            case BenefitCalculationType.FREE:
              // No specific parameters needed
              break;
          }

          // Create benefit assignment
          await BenefitAssignmentModel.create({
            beneficiaryId: beneficiary.id,
            benefitTypeId: task.benefitTypeId,
            tripsRemaining,
            kilometersRemaining,
            discountPercent,
            validFrom: new Date(),
            isActive: true,
          });

          // Log operation
          await BeneficiaryModel.logOperation(
            beneficiary.id,
            OperationType.BENEFIT_ASSIGNED,
            task.createdBy,
            'System', // Could be improved to get actual user name
            {
              benefitTypeId: task.benefitTypeId,
              benefitTypeName: benefitType.name,
              taskId,
            }
          );

          processed++;
        } catch (error: any) {
          errors.push(`Льготник ${beneficiary.id}: ${error.message}`);
        }

        // Update progress
        if (processed % 10 === 0) {
          await CalculationTaskModel.update(taskId, {
            processedBeneficiaries: processed,
          });
        }
      }

      // Complete task
      await CalculationTaskModel.update(taskId, {
        status: TaskStatus.COMPLETED,
        processedBeneficiaries: processed,
        completedAt: new Date(),
        errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
      });
    } catch (error: any) {
      await CalculationTaskModel.update(taskId, {
        status: TaskStatus.FAILED,
        errorMessage: error.message,
      });
      throw error;
    }
  }
}


