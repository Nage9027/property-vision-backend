import { getHomepageHero, setHomepageHero } from '../services/property.service.js';

export async function getHero(req, res, next) {
  try {
    const data = await getHomepageHero();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function setHero(req, res, next) {
  try {
    const data = await setHomepageHero(req.body.propertyId, req.body.homepageStatus);
    res.json({ success: true, data, message: 'Homepage hero updated successfully.' });
  } catch (error) {
    next(error);
  }
}
