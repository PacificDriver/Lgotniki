"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.get('/me', userController_1.getCurrentProfile);
router.put('/me', userController_1.updateCurrentProfile);
router.get('/operators', (0, auth_1.requireRole)('admin'), userController_1.listOperators);
router.post('/operators', (0, auth_1.requireRole)('admin'), userController_1.createOperator);
router.put('/operators/:id', (0, auth_1.requireRole)('admin'), userController_1.updateOperator);
router.delete('/operators/:id', (0, auth_1.requireRole)('admin'), userController_1.deleteOperator);
exports.default = router;
//# sourceMappingURL=user.js.map