import multer from 'multer';
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { uploadFiles } from '../services/upload.service.js';
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 120 * 1024 * 1024,
    },
});
export const uploadRoutes = Router();
uploadRoutes.post('/', authMiddleware, requireRole('ADMIN'), upload.array('files', 20), async (req, res, next) => {
    try {
        const files = (req.files ?? []);
        if (!files.length) {
            return res.status(400).json({ success: false, message: 'No files uploaded.' });
        }
        const folder = typeof req.body.folder === 'string' && req.body.folder.trim() ? req.body.folder.trim() : 'property-vision';
        const data = await uploadFiles(files, { folder });
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
