import multer from 'multer';
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import * as bannerController from '../controllers/banner.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 120 * 1024 * 1024 },
});

export const bannerRoutes = Router();

bannerRoutes.get('/active', bannerController.getActive);
bannerRoutes.get('/', authMiddleware, requireRole('ADMIN'), bannerController.list);
bannerRoutes.get('/:id', authMiddleware, requireRole('ADMIN'), bannerController.getById);
bannerRoutes.post('/', authMiddleware, requireRole('ADMIN'), bannerController.create);
bannerRoutes.put('/:id', authMiddleware, requireRole('ADMIN'), bannerController.update);
bannerRoutes.delete('/:id', authMiddleware, requireRole('ADMIN'), bannerController.remove);
bannerRoutes.post('/upload', authMiddleware, requireRole('ADMIN'), upload.single('file'), bannerController.upload);
