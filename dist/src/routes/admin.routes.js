import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getPropertyDashboardStats, listAllProperties, getAdminPropertyMedia, deletePropertyMedia, createPropertyMedia } from '../services/property.service.js';
import { listLeads } from '../services/lead.service.js';
import { uploadFile } from '../services/upload.service.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 120 * 1024 * 1024 } });

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

adminRoutes.get('/property-media/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const data = await getAdminPropertyMedia(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

adminRoutes.post('/property-media/upload', authMiddleware, requireRole('ADMIN'), upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided.' });
    }
    const { propertyId, type } = req.body;
    if (!propertyId || !type) {
      return res.status(400).json({ success: false, message: 'propertyId and type are required.' });
    }
    const result = await uploadFile(req.file, { folder: `property-vision/properties` });
    const media = await createPropertyMedia(propertyId, type, result.url);
    res.status(201).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
});

adminRoutes.delete('/property-media/:id', authMiddleware, requireRole('ADMIN'), async (req, res, next) => {
  try {
    await deletePropertyMedia(req.params.id);
    res.json({ success: true, message: 'Media deleted successfully.' });
  } catch (error) {
    next(error);
  }
});
