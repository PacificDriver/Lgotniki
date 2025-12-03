"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const beneficiary_1 = __importDefault(require("./beneficiary"));
const benefitType_1 = __importDefault(require("./benefitType"));
const calculationTask_1 = __importDefault(require("./calculationTask"));
const fileUpload_1 = __importDefault(require("./fileUpload"));
const api_1 = __importDefault(require("./api"));
const user_1 = __importDefault(require("./user"));
const router = express_1.default.Router();
router.use('/auth', auth_1.default);
router.use('/beneficiaries', beneficiary_1.default);
router.use('/benefit-types', benefitType_1.default);
router.use('/calculation-tasks', calculationTask_1.default);
router.use('/file-upload', fileUpload_1.default);
router.use('/api', api_1.default);
router.use('/users', user_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map