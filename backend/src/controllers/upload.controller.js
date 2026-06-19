import { uploadFiles } from '../services/upload.service.js';

export async function upload(req, res, next) {
  try {
    const files = req.files ?? [];
    if (!files.length) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }

    const folder = typeof req.body.folder === 'string' && req.body.folder.trim() ? req.body.folder.trim() : 'property-vision';
    const data = await uploadFiles(files, { folder });
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
