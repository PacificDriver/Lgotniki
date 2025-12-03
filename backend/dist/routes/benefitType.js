"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const benefitTypeController_1 = require("../controllers/benefitTypeController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// List and get - available to all authenticated users
router.get('/', benefitTypeController_1.listBenefitTypes);
router.get('/:id', benefitTypeController_1.getBenefitType);
// Create and update - available to admin and operator
router.post('/', (0, auth_1.requireRole)('admin', 'operator'), benefitTypeController_1.createBenefitType);
router.put('/:id', (0, auth_1.requireRole)('admin', 'operator'), benefitTypeController_1.updateBenefitType);
// Delete - only admin
router.delete('/:id', (0, auth_1.requireRole)('admin'), benefitTypeController_1.deleteBenefitType);
exports.default = router;
//# sourceMappingURL=benefitType.js.map