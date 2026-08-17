import { Router } from 'express';
import { database } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.get('/property/:propertyId', async (req, res, next) => {
    try {
        const plots = await database.plot.findMany({
            where: { propertyId: req.params.propertyId },
            orderBy: { plotNumber: 'asc' },
        });
        res.json({ success: true, data: plots });
    } catch (err) { next(err); }
});

router.get('/property/:propertyId/summary', async (req, res, next) => {
    try {
        const plots = await database.plot.findMany({ where: { propertyId: req.params.propertyId } });
        const summary = {
            total: plots.length,
            available: plots.filter(p => p.status === 'AVAILABLE').length,
            sold: plots.filter(p => p.status === 'SOLD').length,
            reserved: plots.filter(p => p.status === 'RESERVED').length,
        };
        res.json({ success: true, data: summary });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const plot = await database.plot.findUnique({ where: { id: req.params.id } });
        if (!plot) return res.status(404).json({ success: false, message: 'Plot not found.' });
        res.json({ success: true, data: plot });
    } catch (err) { next(err); }
});

router.post('/property/:propertyId', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
    try {
        const plot = await database.plot.create({ data: { ...req.body, propertyId: req.params.propertyId } });
        res.status(201).json({ success: true, data: plot });
    } catch (err) { next(err); }
});

router.post('/property/:propertyId/bulk', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
    try {
        const { plots } = req.body;
        const created = await database.plot.createMany({
            data: plots.map(p => ({ ...p, propertyId: req.params.propertyId })),
        });
        res.status(201).json({ success: true, data: created });
    } catch (err) { next(err); }
});

router.put('/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
    try {
        const plot = await database.plot.update({ where: { id: req.params.id }, data: req.body });
        res.json({ success: true, data: plot });
    } catch (err) { next(err); }
});

router.delete('/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
    try {
        await database.plot.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Plot deleted.' });
    } catch (err) { next(err); }
});

export { router as plotRoutes };
