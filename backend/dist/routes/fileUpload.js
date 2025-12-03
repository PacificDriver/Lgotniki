"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileUploadController_1 = require("../controllers/fileUploadController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// File upload - available to admin and operator
router.post('/', (0, auth_1.requireRole)('admin', 'operator'), fileUploadController_1.uploadFile, fileUploadController_1.processFile);
exports.default = router;
//# sourceMappingURL=fileUpload.js.map