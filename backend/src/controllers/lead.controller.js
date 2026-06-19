import { createLead, listLeads } from '../services/lead.service.js';

export async function create(req, res, next) {
  try {
    const data = await createLead(req.body);
    res.status(201).json({ success: true, data, message: 'Thank you. We will contact you soon.' });
  } catch (error) {
    next(error);
  }
}

export async function list(_req, res, next) {
  try {
    const data = await listLeads();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
