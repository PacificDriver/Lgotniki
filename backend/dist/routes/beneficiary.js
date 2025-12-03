"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const beneficiaryController_1 = require("../controllers/beneficiaryController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// List and get operations - available to all authenticated users
router.get('/', beneficiaryController_1.listBeneficiaries);
router.get('/:id', beneficiaryController_1.getBeneficiary);
router.get('/:id/operations', beneficiaryController_1.getBeneficiaryOperations);
// Create and update - available to admin and operator
router.post('/', (0, auth_1.requireRole)('admin', 'operator'), beneficiaryController_1.createBeneficiary);
router.put('/:id', (0, auth_1.requireRole)('admin', 'operator'), beneficiaryController_1.updateBeneficiary);
// Delete - only admin
router.delete('/:id', (0, auth_1.requireRole)('admin'), beneficiaryController_1.deleteBeneficiary);
exports.default = router;
//# sourceMappingURL=beneficiary.js.map