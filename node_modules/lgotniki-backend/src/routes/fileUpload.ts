import express from 'express';
import { uploadFile, processFile } from '../controllers/fileUploadController';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// File upload - available to admin and operator
router.post('/', requireRole('admin', 'operator'), uploadFile, processFile);

export default router;

