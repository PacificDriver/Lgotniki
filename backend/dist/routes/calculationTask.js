"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const calculationTaskController_1 = require("../controllers/calculationTaskController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// List and get - available to all authenticated users
router.get('/', calculationTaskController_1.listTasks);
router.get('/:id', calculationTaskController_1.getTask);
// Create and execute - available to admin and operator
router.post('/', (0, auth_1.requireRole)('admin', 'operator'), calculationTaskController_1.createTask);
router.post('/:id/execute', (0, auth_1.requireRole)('admin', 'operator'), calculationTaskController_1.executeTask);
exports.default = router;
//# sourceMappingURL=calculationTask.js.map