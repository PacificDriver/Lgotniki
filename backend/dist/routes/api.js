"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiController_1 = require("../controllers/apiController");
const router = express_1.default.Router();
// Public API endpoints (no authentication required for now)
// In production, you might want to add API key authentication
router.post('/check-benefit', apiController_1.checkBenefit);
router.post('/record-usage', apiController_1.recordBenefitUsage);
exports.default = router;
//# sourceMappingURL=api.js.map