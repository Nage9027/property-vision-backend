import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { propertyCreateSchema, propertyUpdateSchema } from '../validators/property.validator.js';
import * as propertyController from '../controllers/property.controller.js';

export const propertyRoutes = Router();

propertyRoutes.get('/', propertyController.list);
propertyRoutes.get('/:id', optionalAuthMiddleware, propertyController.getById);
propertyRoutes.post('/', authMiddleware, requireRole('ADMIN'), validateBody(propertyCreateSchema), propertyController.create);
propertyRoutes.patch('/:id', authMiddleware, requireRole('ADMIN'), validateBody(propertyUpdateSchema), propertyController.update);
propertyRoutes.post('/:id/publish', authMiddleware, requireRole('ADMIN'), propertyController.publish);
propertyRoutes.post('/:id/unpublish', authMiddleware, requireRole('ADMIN'), propertyController.unpublish);
