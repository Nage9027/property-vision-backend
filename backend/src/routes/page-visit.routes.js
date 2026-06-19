import { Router } from 'express';
import { database } from '../config/database.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

export const pageVisitRoutes = Router();

pageVisitRoutes.post('/', async (req, res) => {
  const { path, userId, referrer } = req.body;
  if (!path) {
    return res.status(400).json({ success: false, message: 'Path is required' });
  }
  try {
    await database.pageVisit.create({
      data: { path, userId: userId ?? null, referrer: referrer ?? null },
    });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: true });
  }
});

pageVisitRoutes.get('/', authMiddleware, requireRole('ADMIN'), async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const count = await database.pageVisit.count({
    where: { createdAt: { gte: thirtyDaysAgo } },
  });
  res.json({ success: true, data: { count } });
});
