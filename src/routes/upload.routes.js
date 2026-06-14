import multer from 'multer';
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import * as uploadController from '../controllers/upload.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 120 * 1024 * 1024,
  },
});

export const uploadRoutes = Router();

uploadRoutes.post(
  '/',
  authMiddleware,
  requireRole('ADMIN'),
  upload.array('files', 20),
  uploadController.upload,
);
