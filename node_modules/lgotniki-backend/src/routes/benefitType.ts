import express from 'express';
import {
  createBenefitType,
  getBenefitType,
  listBenefitTypes,
  updateBenefitType,
  deleteBenefitType,
} from '../controllers/benefitTypeController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// List and get - available to all authenticated users
router.get('/', listBenefitTypes);
router.get('/:id', getBenefitType);

// Create and update - available to admin and operator
router.post('/', requireRole('admin', 'operator'), createBenefitType);
router.put('/:id', requireRole('admin', 'operator'), updateBenefitType);

// Delete - only admin
router.delete('/:id', requireRole('admin'), deleteBenefitType);

export default router;

