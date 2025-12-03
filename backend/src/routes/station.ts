import express from 'express';
import {
  listStations,
  getStation,
  syncStations,
  syncRoutes,
  getSyncLogs,
  getRaces,
} from '../controllers/stationController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Stations
router.get('/', listStations);

// Sync operations - only for admin (must be before /:id)
router.post('/sync', requireRole('admin'), syncStations);
router.post('/routes/sync', requireRole('admin'), syncRoutes);

// Get sync logs - admin and operator (must be before /:id)
router.get('/logs/sync', requireRole('admin', 'operator'), getSyncLogs);

// Get races from external API (must be before /:id)
router.get('/races/search', getRaces);

// Get station by id (must be last)
router.get('/:id', getStation);

export default router;

