import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { leadSchema } from '../validators/lead.validator.js';
import * as leadController from '../controllers/lead.controller.js';

export const leadRoutes = Router();

leadRoutes.post('/', validateBody(leadSchema), leadController.create);
leadRoutes.get('/', authMiddleware, requireRole('ADMIN'), leadController.list);
