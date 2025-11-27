import express from 'express';
import {
  createTask,
  getTask,
  listTasks,
  executeTask,
} from '../controllers/calculationTaskController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// List and get - available to all authenticated users
router.get('/', listTasks);
router.get('/:id', getTask);

// Create and execute - available to admin and operator
router.post('/', requireRole('admin', 'operator'), createTask);
router.post('/:id/execute', requireRole('admin', 'operator'), executeTask);

export default router;

