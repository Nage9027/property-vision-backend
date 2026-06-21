import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import * as adminController from '../controllers/admin.controller.js';

const upload = multer({ storage: multer.memoryStorage() });

export const adminRoutes = Router();

adminRoutes.get('/dashboard', authMiddleware, requireRole('ADMIN'), adminController.dashboard);
adminRoutes.get('/properties', authMiddleware, requireRole('ADMIN'), adminController.listProperties);
adminRoutes.get('/visits', authMiddleware, requireRole('ADMIN'), adminController.visitStats);
adminRoutes.get('/properties/:id/media', authMiddleware, requireRole('ADMIN'), adminController.getPropertyMedia);
adminRoutes.delete('/media/:id', authMiddleware, requireRole('ADMIN'), adminController.deleteMediaItem);
adminRoutes.post('/media/upload', authMiddleware, requireRole('ADMIN'), upload.single('file'), adminController.createMediaItem);
