import { getPropertyPageHero, updatePropertyPageHero } from '../services/property.service.js';

export async function getHero(req, res, next) {
  try {
    const data = await getPropertyPageHero();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateHero(req, res, next) {
  try {
    const data = await updatePropertyPageHero(req.body);
    res.json({ success: true, data, message: 'Property page hero updated successfully.' });
  } catch (error) {
    next(error);
  }
}
