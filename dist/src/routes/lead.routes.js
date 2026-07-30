import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { leadSchema } from '../validators/lead.validator.js';
import { createLead, listLeads } from '../services/lead.service.js';
export const leadRoutes = Router();
leadRoutes.post('/', validateBody(leadSchema), async (req, res, next) => {
    try {
        const data = await createLead(req.body);
        res.status(201).json({ success: true, data, message: 'Thank you. We will contact you soon.' });
    }
    catch (error) {
        next(error);
    }
});
leadRoutes.get('/', authMiddleware, requireRole('ADMIN'), async (_req, res, next) => {
    try {
        const data = await listLeads();
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
