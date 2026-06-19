import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { plotCreateSchema, plotUpdateSchema, plotBulkCreateSchema } from '../validators/plot.validator.js';
import * as plotController from '../controllers/plot.controller.js';

export const plotRoutes = Router();

plotRoutes.get('/property/:propertyId', plotController.listByProperty);
plotRoutes.get('/property/:propertyId/summary', plotController.summary);
plotRoutes.get('/:id', plotController.getById);
plotRoutes.post('/property/:propertyId', authMiddleware, requireRole('ADMIN'), validateBody(plotCreateSchema), plotController.create);
plotRoutes.post('/property/:propertyId/bulk', authMiddleware, requireRole('ADMIN'), validateBody(plotBulkCreateSchema), plotController.bulkCreate);
plotRoutes.patch('/:id', authMiddleware, requireRole('ADMIN'), validateBody(plotUpdateSchema), plotController.update);
plotRoutes.delete('/:id', authMiddleware, requireRole('ADMIN'), plotController.remove);
