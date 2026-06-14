import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { propertyCreateSchema, propertyUpdateSchema } from '../validators/property.validator.js';
import { createProperty, getPropertyByIdentifier, listPublishedProperties, setPropertyStatus, updateProperty, } from '../services/property.service.js';
export const propertyRoutes = Router();
function asString(value) {
    return Array.isArray(value) ? value[0] : value ?? '';
}
propertyRoutes.get('/', async (_req, res, next) => {
    try {
        const data = await listPublishedProperties();
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
propertyRoutes.get('/:id', optionalAuthMiddleware, async (req, res, next) => {
    try {
        const data = await getPropertyByIdentifier(asString(req.params.id), req.user?.role === 'ADMIN');
        if (!data) {
            return res.status(404).json({ success: false, message: 'Property not found.' });
        }
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
propertyRoutes.post('/', authMiddleware, requireRole('ADMIN'), validateBody(propertyCreateSchema), async (req, res, next) => {
    try {
        const data = await createProperty(req.body);
        res.status(201).json({ success: true, data, message: 'Property created successfully.' });
    }
    catch (error) {
        next(error);
    }
});
propertyRoutes.patch('/:id', authMiddleware, requireRole('ADMIN'), validateBody(propertyUpdateSchema), async (req, res, next) => {
    try {
        const data = await updateProperty(asString(req.params.id), req.body);
        if (!data) {
            return res.status(404).json({ success: false, message: 'Property not found.' });
        }
        res.json({ success: true, data, message: 'Property updated successfully.' });
    }
    catch (error) {
        next(error);
    }
});
propertyRoutes.post('/:id/publish', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
    try {
        const data = await setPropertyStatus(asString(req.params.id), 'PUBLISHED');
        if (!data) {
            return res.status(404).json({ success: false, message: 'Property not found.' });
        }
        res.json({ success: true, data, message: 'Property published successfully.' });
    }
    catch (error) {
        next(error);
    }
});
propertyRoutes.post('/:id/unpublish', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
    try {
        const data = await setPropertyStatus(asString(req.params.id), 'DRAFT');
        if (!data) {
            return res.status(404).json({ success: false, message: 'Property not found.' });
        }
        res.json({ success: true, data, message: 'Property moved to draft.' });
    }
    catch (error) {
        next(error);
    }
});
