import { Router } from 'express';
import { database } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const submission = await database.contactSubmission.create({ data: req.body });
        res.status(201).json({ success: true, data: submission });
    } catch (err) { next(err); }
});

router.get('/', authMiddleware, requireRole('ADMIN'), async (_req, res, next) => {
    try {
        const submissions = await database.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: submissions });
    } catch (err) { next(err); }
});

export { router as contactRoutes };
