import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { heroSetSchema } from '../validators/property.validator.js';
import * as homepageController from '../controllers/homepage.controller.js';

export const homepageRoutes = Router();

homepageRoutes.get('/hero', homepageController.getHero);
homepageRoutes.post('/hero/set', authMiddleware, requireRole('ADMIN'), validateBody(heroSetSchema), homepageController.setHero);
