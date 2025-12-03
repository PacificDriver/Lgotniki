import express from 'express';
import authRoutes from './auth';
import beneficiaryRoutes from './beneficiary';
import benefitTypeRoutes from './benefitType';
import calculationTaskRoutes from './calculationTask';
import fileUploadRoutes from './fileUpload';
import apiRoutes from './api';
import userRoutes from './user';
import stationRoutes from './station';
import routeRoutes from './route';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/beneficiaries', beneficiaryRoutes);
router.use('/benefit-types', benefitTypeRoutes);
router.use('/calculation-tasks', calculationTaskRoutes);
router.use('/file-upload', fileUploadRoutes);
router.use('/api', apiRoutes);
router.use('/users', userRoutes);
router.use('/stations', stationRoutes);
router.use('/routes', routeRoutes);

export default router;

