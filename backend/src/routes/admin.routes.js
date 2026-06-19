import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import * as adminController from '../controllers/admin.controller.js';

export const adminRoutes = Router();

adminRoutes.get('/dashboard', authMiddleware, requireRole('ADMIN'), adminController.dashboard);
adminRoutes.get('/properties', authMiddleware, requireRole('ADMIN'), adminController.listProperties);
