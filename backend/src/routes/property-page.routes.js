import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { propertyHeroSchema } from '../validators/property.validator.js';
import * as propertyPageController from '../controllers/property-page.controller.js';

export const propertyPageRoutes = Router();

propertyPageRoutes.get('/hero', propertyPageController.getHero);
propertyPageRoutes.put('/hero', authMiddleware, requireRole('ADMIN'), validateBody(propertyHeroSchema), propertyPageController.updateHero);
