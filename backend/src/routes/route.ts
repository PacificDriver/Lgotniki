import express from 'express';
import {
  listRoutes,
  getRoute,
  createRoute,
  updateRoute,
  deleteRoute,
  getRouteNumbers,
} from '../controllers/routeController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// List and get - available to all authenticated users
router.get('/numbers', getRouteNumbers); // Must be before /:id
router.get('/', listRoutes);
router.get('/:id', getRoute);

// Create, update, delete - only admin and operator
router.post('/', requireRole('admin', 'operator'), createRoute);
router.put('/:id', requireRole('admin', 'operator'), updateRoute);
router.delete('/:id', requireRole('admin'), deleteRoute);

export default router;

