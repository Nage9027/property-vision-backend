import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getPropertyDashboardStats, listAllProperties } from '../services/property.service.js';
import { listLeads } from '../services/lead.service.js';
export const adminRoutes = Router();
adminRoutes.get('/dashboard', authMiddleware, requireRole('ADMIN'), async (_req, res, next) => {
    try {
        const [stats, leads] = await Promise.all([getPropertyDashboardStats(), listLeads()]);
        res.json({ success: true, data: { stats, leads: leads.slice(0, 10) } });
    }
    catch (error) {
        next(error);
    }
});
adminRoutes.get('/properties', authMiddleware, requireRole('ADMIN'), async (_req, res, next) => {
    try {
        const data = await listAllProperties();
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
