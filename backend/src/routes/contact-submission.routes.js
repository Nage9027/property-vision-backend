import { Router } from 'express';
import { database } from '../config/database.js';

export const contactSubmissionRoutes = Router();

contactSubmissionRoutes.post('/', async (req, res) => {
  const { name, email, phone, message, propertyInterest } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email, and phone are required' });
  }
  try {
    await database.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        message: message ?? '',
        propertyInterest: propertyInterest ?? null,
      },
    });
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
