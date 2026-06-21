import {
  createProperty,
  getPropertyByIdentifier,
  listPublishedProperties,
  setPropertyStatus,
  updateProperty,
} from '../services/property.service.js';
import { database } from '../config/database.js';

function asString(value) {
  return Array.isArray(value) ? value[0] : value ?? '';
}

export async function list(_req, res, next) {
  try {
    const data = await listPublishedProperties();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const data = await getPropertyByIdentifier(asString(req.params.id), req.user?.role === 'ADMIN');
    if (!data) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const data = await createProperty(req.body);
    res.status(201).json({ success: true, data, message: 'Property created successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const data = await updateProperty(asString(req.params.id), req.body);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }
    res.json({ success: true, data, message: 'Property updated successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function publish(req, res, next) {
  try {
    const data = await setPropertyStatus(asString(req.params.id), 'PUBLISHED');
    if (!data) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }
    res.json({ success: true, data, message: 'Property published successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function unpublish(req, res, next) {
  try {
    const data = await setPropertyStatus(asString(req.params.id), 'DRAFT');
    if (!data) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }
    res.json({ success: true, data, message: 'Property moved to draft.' });
  } catch (error) {
    next(error);
  }
}

export async function getMedia(req, res, next) {
  try {
    const identifier = asString(req.params.slug);
    const property = await database.property.findFirst({
      where: { OR: [{ id: identifier }, { slug: identifier }] },
      select: { id: true, slug: true, title: true },
    });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    const media = await database.propertyMedia.findMany({
      where: { propertyId: property.id },
      orderBy: { sortOrder: 'asc' },
    });

    const photos = media.filter((m) => m.type === 'image' || m.type.includes('image'));
    const videos = media.filter((m) => m.type === 'video' || m.type.includes('video'));
    const masterPlans = media.filter((m) => m.type === 'master-plan' || m.type === 'masterplan' || m.type.includes('master'));
    const droneViews = media.filter((m) => m.type === 'drone' || m.type.includes('drone'));

    const map = (items) => items.map((m) => ({
      id: m.id,
      propertyId: m.propertyId,
      type: m.type,
      url: m.url,
      title: m.caption ?? '',
      sortOrder: m.sortOrder,
    }));

    res.json({
      success: true,
      data: {
        photos: map(photos),
        videos: map(videos),
        masterPlans: map(masterPlans),
        droneViews: map(droneViews),
      },
    });
  } catch (error) {
    next(error);
  }
}
