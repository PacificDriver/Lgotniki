"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFile = exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const promises_1 = __importDefault(require("fs/promises"));
const fileUploadService_1 = require("../services/fileUploadService");
const database_1 = __importDefault(require("../config/database"));
const upload = (0, multer_1.default)({
    dest: process.env.UPLOAD_DIR || './uploads',
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
    },
});
exports.uploadFile = upload.single('file');
const processFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Файл не загружен' });
        }
        const { loadMode } = req.body;
        if (!loadMode) {
            return res.status(400).json({ error: 'Режим загрузки не указан' });
        }
        if (!req.user) {
            return res.status(401).json({ error: 'Пользователь не аутентифицирован' });
        }
        // Parse file
        const records = await fileUploadService_1.FileUploadService.parseFile(req.file.path, req.file.mimetype);
        // Log upload
        const uploadResult = await database_1.default.query(`INSERT INTO file_uploads (filename, original_filename, file_type, load_mode, total_rows, uploaded_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`, [
            req.file.filename,
            req.file.originalname,
            req.file.mimetype,
            loadMode,
            records.length,
            req.user.id,
        ]);
        const uploadId = uploadResult.rows[0].id;
        // Process records
        const result = await fileUploadService_1.FileUploadService.processUpload(records, loadMode, req.user.id, req.user.fullName);
        // Update upload log
        await database_1.default.query(`UPDATE file_uploads 
      SET processed_rows = $1, errors = $2, completed_at = CURRENT_TIMESTAMP
      WHERE id = $3`, [result.created + result.updated, JSON.stringify(result.errors), uploadId]);
        // Clean up file
        await promises_1.default.unlink(req.file.path).catch(() => { });
        return res.json({
            uploadId,
            ...result,
        });
    }
    catch (error) {
        console.error('Process file error:', error);
        // Clean up file if exists
        if (req.file) {
            await promises_1.default.unlink(req.file.path).catch(() => { });
        }
        return res.status(500).json({ error: error.message || 'Ошибка при обработке файла' });
    }
};
exports.processFile = processFile;
//# sourceMappingURL=fileUploadController.js.map