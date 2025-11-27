import express from 'express';
import { checkBenefit, recordBenefitUsage } from '../controllers/apiController';

const router = express.Router();

// Public API endpoints (no authentication required for now)
// In production, you might want to add API key authentication
router.post('/check-benefit', checkBenefit);
router.post('/record-usage', recordBenefitUsage);

export default router;

