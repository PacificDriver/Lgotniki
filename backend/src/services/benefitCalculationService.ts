import { BeneficiaryModel } from '../models/Beneficiary';
import { BenefitTypeModel } from '../models/BenefitType';
import { BenefitAssignmentModel } from '../models/BenefitAssignment';
import { CalculationTaskModel } from '../models/CalculationTask';
import { TaskStatus, BenefitCalculationType, OperationType } from '../types';
import pool from '../config/database';

export interface ConflictResolution {
  action: 'replace' | 'add_secondary' | 'skip';
  deactivateExisting?: boolean;
}

export class BenefitCalculationService {
  static async executeTask(
    taskId: string,
    conflictResolution: ConflictResolution = { action: 'skip' }
  ): Promise<void> {
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
      
      // If specific beneficiary IDs are provided, they have priority
      if (task.filters?.beneficiaryIds && Array.isArray(task.filters.beneficiaryIds) && task.filters.beneficiaryIds.length > 0) {
        filters.beneficiaryIds = task.filters.beneficiaryIds;
      } else {
        // Otherwise use other filters
        if (task.filters?.status) filters.status = task.filters.status;
        if (task.filters?.benefitTypeId) filters.benefitTypeId = task.filters.benefitTypeId;
        if (task.filters?.search) filters.search = task.filters.search;
        if (task.filters?.ageFrom) filters.ageFrom = task.filters.ageFrom;
        if (task.filters?.ageTo) filters.ageTo = task.filters.ageTo;
        if (task.filters?.birthMonth) filters.birthMonth = task.filters.birthMonth;
        if (task.filters?.birthDay) filters.birthDay = task.filters.birthDay;
        if (task.filters?.residence) filters.residence = task.filters.residence;
      }

      const { beneficiaries, total } = await BeneficiaryModel.findAll(filters);
      
      await CalculationTaskModel.update(taskId, {
        totalBeneficiaries: total,
      });

      let processed = 0;
      let errors: string[] = [];
      let conflicts: any[] = [];

      for (const beneficiary of beneficiaries) {
        try {
          // Check if beneficiary already has active benefits
          const existingAssignments = await BenefitAssignmentModel.findByBeneficiary(
            beneficiary.id,
            true
          );

          const hasActiveAssignment = existingAssignments.some(
            (a) => a.isActive
          );

          if (hasActiveAssignment) {
            // Handle conflict based on resolution strategy
            switch (conflictResolution.action) {
              case 'skip':
                processed++;
                conflicts.push({
                  beneficiary: beneficiary.fullName,
                  existingBenefits: existingAssignments.length,
                  action: 'skipped',
                });
                continue;

              case 'replace':
                // Deactivate existing assignments
                for (const assignment of existingAssignments) {
                  await BenefitAssignmentModel.update(assignment.id, {
                    isActive: false,
                  });
                }
                conflicts.push({
                  beneficiary: beneficiary.fullName,
                  existingBenefits: existingAssignments.length,
                  action: 'replaced',
                });
                break;

              case 'add_secondary':
                // Allow multiple active assignments
                conflicts.push({
                  beneficiary: beneficiary.fullName,
                  existingBenefits: existingAssignments.length,
                  action: 'added_secondary',
                });
                break;
            }
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

          // Get user name for logging
          let userName = 'Система';
          try {
            const userResult = await pool.query(
              'SELECT full_name FROM users WHERE id = $1',
              [task.createdBy]
            );
            if (userResult.rows.length > 0) {
              userName = userResult.rows[0].full_name;
            }
          } catch (error) {
            console.error('Error fetching user name:', error);
          }

          // Check if benefitTypeId changed
          const oldBenefitTypeId = beneficiary.benefitTypeId;
          const benefitTypeChanged = oldBenefitTypeId !== task.benefitTypeId;

          // Update beneficiary's benefitTypeId
          console.log(`Updating beneficiary ${beneficiary.id}: benefitTypeId from ${oldBenefitTypeId} to ${task.benefitTypeId}`);
          const updatedBeneficiary = await BeneficiaryModel.update(beneficiary.id, {
            benefitTypeId: task.benefitTypeId,
          });
          
          if (!updatedBeneficiary) {
            console.error(`Failed to update beneficiary ${beneficiary.id}`);
            throw new Error(`Не удалось обновить льготника ${beneficiary.id}`);
          }
          
          console.log(`Beneficiary ${beneficiary.id} updated. New benefitTypeId: ${updatedBeneficiary.benefitTypeId}`);

          // Log benefit assignment
          await BeneficiaryModel.logOperation(
            beneficiary.id,
            OperationType.BENEFIT_ASSIGNED,
            task.createdBy,
            userName,
            {
              benefitTypeId: task.benefitTypeId,
              benefitTypeName: benefitType.name,
              taskId,
              conflictResolution: conflictResolution.action,
            }
          );

          // Log benefit type change separately if it changed
          if (benefitTypeChanged) {
            let oldBenefitTypeName = null;
            if (oldBenefitTypeId) {
              try {
                const oldBenefitType = await BenefitTypeModel.findById(oldBenefitTypeId);
                oldBenefitTypeName = oldBenefitType?.name || null;
              } catch (error) {
                console.error('Error fetching old benefit type:', error);
              }
            }

            await BeneficiaryModel.logOperation(
              beneficiary.id,
              OperationType.BENEFIT_TYPE_CHANGED,
              task.createdBy,
              userName,
              {
                oldBenefitTypeId,
                oldBenefitTypeName,
                newBenefitTypeId: task.benefitTypeId,
                newBenefitTypeName: benefitType.name,
                taskId,
              }
            );
          }

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


