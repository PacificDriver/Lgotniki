import { Response } from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { FileUploadService } from '../services/fileUploadService';
import { AuthRequest } from '../middleware/auth';
import pool from '../config/database';

const upload = multer({
  dest: process.env.UPLOAD_DIR || './uploads',
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
  },
});

export const uploadFile = upload.single('file');

export const processFile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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
    const records = await FileUploadService.parseFile(req.file.path, req.file.mimetype);

    // Log upload
    const uploadResult = await pool.query(
      `INSERT INTO file_uploads (filename, original_filename, file_type, load_mode, total_rows, uploaded_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        loadMode,
        records.length,
        req.user.id,
      ]
    );

    const uploadId = uploadResult.rows[0].id;

    // Process records
    const result = await FileUploadService.processUpload(
      records,
      loadMode as any,
      req.user.id,
      req.user.fullName
    );

    // Update upload log
    await pool.query(
      `UPDATE file_uploads 
      SET processed_rows = $1, errors = $2, completed_at = CURRENT_TIMESTAMP
      WHERE id = $3`,
      [result.created + result.updated, JSON.stringify(result.errors), uploadId]
    );

    // Clean up file
    await fs.unlink(req.file.path).catch(() => {});

    return res.json({
      uploadId,
      ...result,
    });
  } catch (error: any) {
    console.error('Process file error:', error);
    
    // Clean up file if exists
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    return res.status(500).json({ error: error.message || 'Ошибка при обработке файла' });
  }
};


