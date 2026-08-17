import { Router } from 'express';
import { database } from '../config/database.js';
import { optionalAuthMiddleware } from '../middleware/auth.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.post('/', optionalAuthMiddleware, async (req, res, next) => {
    try {
        const { path, referrer } = req.body;
        const visit = await database.pageVisit.create({
            data: { path, referrer, userId: req.user?.id ?? null },
        });
        res.status(201).json({ success: true, data: visit });
    } catch (err) { next(err); }
});

router.get('/', authMiddleware, requireRole('ADMIN'), async (_req, res, next) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const twelveMonthsAgo = new Date(now);
        twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

        const allVisits = await database.pageVisit.findMany({
            where: { createdAt: { gte: twelveMonthsAgo } },
            select: { createdAt: true },
        });

        const dailyMap = {};
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            dailyMap[key] = 0;
        }

        const monthMap = {};
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now);
            d.setMonth(d.getMonth() - i);
            const key = d.toISOString().slice(0, 7);
            monthMap[key] = 0;
        }

        const yearMap = {};
        const currentYear = now.getFullYear();
        for (let y = currentYear - 4; y <= currentYear; y++) {
            yearMap[String(y)] = 0;
        }

        for (const { createdAt } of allVisits) {
            const dayKey = createdAt.toISOString().slice(0, 10);
            const monthKey = createdAt.toISOString().slice(0, 7);
            const yearKey = String(createdAt.getFullYear());
            if (dailyMap[dayKey] !== undefined) dailyMap[dayKey]++;
            if (monthMap[monthKey] !== undefined) monthMap[monthKey]++;
            if (yearMap[yearKey] !== undefined) yearMap[yearKey]++;
        }

        const daily = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));
        const monthly = Object.entries(monthMap).map(([month, count]) => ({ month, count }));
        const yearly = Object.entries(yearMap).map(([year, count]) => ({ year, count }));

        const total30d = daily.reduce((sum, d) => sum + d.count, 0);

        res.json({ success: true, data: { daily, monthly, yearly, total30d } });
    } catch (err) { next(err); }
});

export { router as pageVisitRoutes };
