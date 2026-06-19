import {
  listBanners,
  getActiveBanner,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../services/banner.service.js';
import { uploadFile } from '../services/upload.service.js';

export async function getActive(req, res, next) {
  try {
    const data = await getActiveBanner();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function list(req, res, next) {
  try {
    const data = await listBanners();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const data = await getBannerById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Banner not found.' });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const data = await createBanner(req.body);
    res.status(201).json({ success: true, data, message: 'Banner created.' });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const data = await updateBanner(req.params.id, req.body);
    res.json({ success: true, data, message: 'Banner updated.' });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await deleteBanner(req.params.id);
    res.json({ success: true, message: 'Banner deleted.' });
  } catch (error) {
    next(error);
  }
}

export async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const folder = 'banners';
    const asset = await uploadFile(req.file, { folder });
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
}
