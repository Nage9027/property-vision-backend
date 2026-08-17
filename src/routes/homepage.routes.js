import { Router } from 'express';
import { database } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.get('/hero', async (_req, res, next) => {
    try {
        const hero = await database.property.findFirst({
            where: { isHomepageHero: true },
            include: { media: true, amenities: true },
        });
        res.json({ success: true, data: hero });
    } catch (err) { next(err); }
});

router.post('/hero/set', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
    try {
        const { propertyId } = req.body;
        await database.property.updateMany({ where: { isHomepageHero: true }, data: { isHomepageHero: false } });
        const updated = await database.property.update({ where: { id: propertyId }, data: { isHomepageHero: true } });
        res.json({ success: true, data: updated });
    } catch (err) { next(err); }
});

export { router as homepageRoutes };
