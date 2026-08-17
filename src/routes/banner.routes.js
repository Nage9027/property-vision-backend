import { Router } from 'express';
import { database } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.get('/active', async (_req, res, next) => {
    try {
        const banner = await database.promotionalBanner.findFirst({
            where: { isActive: true },
            orderBy: { priority: 'desc' },
        });
        res.json({ success: true, data: banner });
    } catch (err) { next(err); }
});

router.get('/', authMiddleware, requireRole('ADMIN'), async (_req, res, next) => {
    try {
        const banners = await database.promotionalBanner.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: banners });
    } catch (err) { next(err); }
});

router.get('/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
    try {
        const banner = await database.promotionalBanner.findUnique({ where: { id: req.params.id } });
        if (!banner) return res.status(404).json({ success: false, message: 'Banner not found.' });
        res.json({ success: true, data: banner });
    } catch (err) { next(err); }
});

router.post('/', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
    try {
        const banner = await database.promotionalBanner.create({ data: req.body });
        res.status(201).json({ success: true, data: banner });
    } catch (err) { next(err); }
});

router.put('/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
    try {
        const banner = await database.promotionalBanner.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data: banner });
    } catch (err) { next(err); }
});

router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
    try {
        await database.promotionalBanner.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Banner deleted.' });
    } catch (err) { next(err); }
});

export { router as bannerRoutes };
