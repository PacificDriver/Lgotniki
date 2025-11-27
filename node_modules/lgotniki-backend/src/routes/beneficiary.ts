import express from 'express';
import {
  createBeneficiary,
  getBeneficiary,
  listBeneficiaries,
  updateBeneficiary,
  deleteBeneficiary,
  getBeneficiaryOperations,
} from '../controllers/beneficiaryController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// List and get operations - available to all authenticated users
router.get('/', listBeneficiaries);
router.get('/:id', getBeneficiary);
router.get('/:id/operations', getBeneficiaryOperations);

// Create and update - available to admin and operator
router.post('/', requireRole('admin', 'operator'), createBeneficiary);
router.put('/:id', requireRole('admin', 'operator'), updateBeneficiary);

// Delete - only admin
router.delete('/:id', requireRole('admin'), deleteBeneficiary);

export default router;

