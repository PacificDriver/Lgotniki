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
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordBenefitUsage = exports.checkBenefit = void 0;
const Beneficiary_1 = require("../models/Beneficiary");
const BenefitAssignment_1 = require("../models/BenefitAssignment");
const BenefitType_1 = require("../models/BenefitType");
const Card_1 = require("../models/Card");
/**
 * Public API endpoint for checking beneficiary eligibility
 * This is a placeholder - will be implemented based on actual requirements
 */
const checkBenefit = async (req, res) => {
    try {
        const { cardId, cardType, phone, routeNumber, settlement } = req.body;
        if (!cardId && !phone) {
            return res.status(400).json({
                error: 'Необходимо указать cardId или phone',
            });
        }
        let beneficiary = null;
        // Find beneficiary by card or phone
        if (cardId && cardType) {
            // Try to find by card
            const card = await Card_1.CardModel.findByIdentifier(cardType, cardId);
            if (card) {
                beneficiary = await Beneficiary_1.BeneficiaryModel.findById(card.beneficiaryId);
            }
            // Also try direct lookup in beneficiary table
            if (!beneficiary) {
                beneficiary = await Beneficiary_1.BeneficiaryModel.findByCard(cardType, cardId);
            }
        }
        if (!beneficiary && phone) {
            beneficiary = await Beneficiary_1.BeneficiaryModel.findByPhone(phone);
        }
        if (!beneficiary) {
            return res.status(404).json({
                eligible: false,
                message: 'Льготник не найден',
            });
        }
        if (beneficiary.status !== 'active') {
            return res.json({
                eligible: false,
                message: `Льготник имеет статус: ${beneficiary.status}`,
                beneficiary: {
                    id: beneficiary.id,
                    fullName: beneficiary.fullName,
                    status: beneficiary.status,
                },
            });
        }
        // Get active benefit assignments
        const assignments = await BenefitAssignment_1.BenefitAssignmentModel.findByBeneficiary(beneficiary.id, true);
        if (assignments.length === 0) {
            return res.json({
                eligible: false,
                message: 'У льготника нет активных льгот',
                beneficiary: {
                    id: beneficiary.id,
                    fullName: beneficiary.fullName,
                },
            });
        }
        // Check if benefit applies to this route/settlement
        const applicableBenefits = [];
        for (const assignment of assignments) {
            const benefitType = await BenefitType_1.BenefitTypeModel.findById(assignment.benefitTypeId);
            if (!benefitType || !benefitType.isActive)
                continue;
            // Check route restriction
            if (routeNumber && benefitType.routes && benefitType.routes.length > 0) {
                if (!benefitType.routes.includes(routeNumber)) {
                    continue; // This benefit doesn't apply to this route
                }
            }
            // Check settlement restriction
            if (settlement && benefitType.settlements && benefitType.settlements.length > 0) {
                if (!benefitType.settlements.includes(settlement)) {
                    continue; // This benefit doesn't apply to this settlement
                }
            }
            // Check time restrictions (if any)
            // TODO: Implement time restriction checking
            // Check if benefit has remaining trips/kilometers
            let hasRemaining = true;
            if (assignment.tripsRemaining !== null && assignment.tripsRemaining !== undefined) {
                hasRemaining = assignment.tripsRemaining > 0;
            }
            if (assignment.kilometersRemaining !== null && assignment.kilometersRemaining !== undefined) {
                hasRemaining = assignment.kilometersRemaining > 0;
            }
            if (hasRemaining) {
                applicableBenefits.push({
                    benefitTypeId: benefitType.id,
                    benefitTypeName: benefitType.name,
                    calculationType: benefitType.calculationType,
                    tripsRemaining: assignment.tripsRemaining,
                    kilometersRemaining: assignment.kilometersRemaining,
                    discountPercent: assignment.discountPercent,
                });
            }
        }
        if (applicableBenefits.length === 0) {
            return res.json({
                eligible: false,
                message: 'Нет применимых льгот для данного маршрута/населенного пункта или льгота исчерпана',
                beneficiary: {
                    id: beneficiary.id,
                    fullName: beneficiary.fullName,
                },
            });
        }
        return res.json({
            eligible: true,
            beneficiary: {
                id: beneficiary.id,
                fullName: beneficiary.fullName,
            },
            benefits: applicableBenefits,
        });
    }
    catch (error) {
        console.error('Check benefit error:', error);
        return res.status(500).json({
            error: error.message || 'Ошибка при проверке льготы',
        });
    }
};
exports.checkBenefit = checkBenefit;
/**
 * Record benefit usage (when ticket is sold)
 */
const recordBenefitUsage = async (req, res) => {
    try {
        const { beneficiaryId, benefitAssignmentId, routeNumber, settlement, tripsUsed, kilometersUsed, amount, cardId, cardType } = req.body;
        if (!beneficiaryId || !benefitAssignmentId) {
            return res.status(400).json({
                error: 'Необходимо указать beneficiaryId и benefitAssignmentId',
            });
        }
        // Record usage in database
        const pool = (await Promise.resolve().then(() => __importStar(require('../config/database')))).default;
        const result = await pool.query(`INSERT INTO benefit_usage (
        benefit_assignment_id, beneficiary_id, route_number, settlement,
        trips_used, kilometers_used, amount, card_id, card_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`, [
            benefitAssignmentId,
            beneficiaryId,
            routeNumber || null,
            settlement || null,
            tripsUsed || 1,
            kilometersUsed || null,
            amount || null,
            cardId || null,
            cardType || null,
        ]);
        // Update assignment remaining values
        const assignment = await BenefitAssignment_1.BenefitAssignmentModel.findById(benefitAssignmentId);
        if (assignment) {
            const updateData = {};
            if (assignment.tripsRemaining !== null && assignment.tripsRemaining !== undefined) {
                updateData.tripsRemaining = Math.max(0, assignment.tripsRemaining - (tripsUsed || 1));
            }
            if (assignment.kilometersRemaining !== null && assignment.kilometersRemaining !== undefined) {
                updateData.kilometersRemaining = Math.max(0, (assignment.kilometersRemaining || 0) - (kilometersUsed || 0));
            }
            if (Object.keys(updateData).length > 0) {
                await BenefitAssignment_1.BenefitAssignmentModel.update(benefitAssignmentId, updateData);
            }
        }
        return res.json({
            success: true,
            usage: result.rows[0],
        });
    }
    catch (error) {
        console.error('Record benefit usage error:', error);
        return res.status(500).json({
            error: error.message || 'Ошибка при записи использования льготы',
        });
    }
};
exports.recordBenefitUsage = recordBenefitUsage;
//# sourceMappingURL=apiController.js.map