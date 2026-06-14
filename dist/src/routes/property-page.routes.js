import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { propertyHeroSchema } from '../validators/property.validator.js';
import { getPropertyPageHero, updatePropertyPageHero } from '../services/property.service.js';
export const propertyPageRoutes = Router();
propertyPageRoutes.get('/hero', async (_req, res, next) => {
    try {
        const data = await getPropertyPageHero();
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
propertyPageRoutes.put('/hero', authMiddleware, requireRole('ADMIN'), validateBody(propertyHeroSchema), async (req, res, next) => {
    try {
        const data = await updatePropertyPageHero(req.body);
        res.json({ success: true, data, message: 'Property page hero updated successfully.' });
    }
    catch (error) {
        next(error);
    }
});
