import express from 'express';
import {
  createOperator,
  deleteOperator,
  getCurrentProfile,
  listOperators,
  updateCurrentProfile,
  updateOperator,
} from '../controllers/userController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/me', getCurrentProfile);
router.put('/me', updateCurrentProfile);

router.get('/operators', requireRole('admin'), listOperators);
router.post('/operators', requireRole('admin'), createOperator);
router.put('/operators/:id', requireRole('admin'), updateOperator);
router.delete('/operators/:id', requireRole('admin'), deleteOperator);

export default router;

