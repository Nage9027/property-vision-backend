import { getPropertyDashboardStats, listAllProperties } from '../services/property.service.js';
import { listLeads } from '../services/lead.service.js';
import { database } from '../config/database.js';

export async function dashboard(req, res, next) {
  try {
      let stats, leads;
      try {
        stats = await getPropertyDashboardStats();
        leads = await listLeads();
      } catch (err) {
        console.error('[ADMIN] Stats/leads query failed:', err instanceof Error ? err.message : String(err));
        const error = new Error(`Dashboard data query failed — ${err instanceof Error ? err.message : String(err)}`);
        error.status = 500;
        throw error;
      }

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      let visits30d = 0, connectedLeads = 0;
      try {
        visits30d = await database.pageVisit.count({ where: { createdAt: { gte: thirtyDaysAgo } } });
        connectedLeads = await database.lead.count({ where: { status: { in: ['CONTACTED', 'QUALIFIED'] } } });
      } catch (err) {
        console.warn('[ADMIN] Visit/lead count query failed (non-fatal):', err instanceof Error ? err.message : String(err));
      }

    res.json({
      success: true,
      data: {
        stats: {
          ...stats,
          visits30d,
          connectedLeads,
        },
        leads: leads ? leads.slice(0, 10) : [],
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function listProperties(req, res, next) {
  try {
    const data = await listAllProperties();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getPropertyMedia(req, res, next) {
  try {
    const propertyId = req.params.id;
    const items = await database.propertyMedia.findMany({
      where: { propertyId },
      orderBy: { sortOrder: 'asc' },
    });

    const bannerImage = items.find((m) => m.type === 'banner-image') ?? null;
    const masterPlan = items.find((m) => m.type === 'master-plan') ?? null;
    const heroVideo = items.find((m) => m.type === 'video') ?? null;
    const galleryImages = items.filter((m) => m.type === 'image');

    res.json({
      success: true,
      data: {
        bannerImage: bannerImage ? { id: bannerImage.id, url: bannerImage.url, type: bannerImage.type, caption: bannerImage.caption, sortOrder: bannerImage.sortOrder } : null,
        masterPlan: masterPlan ? { id: masterPlan.id, url: masterPlan.url, type: masterPlan.type, caption: masterPlan.caption, sortOrder: masterPlan.sortOrder } : null,
        heroVideo: heroVideo ? { id: heroVideo.id, url: heroVideo.url, type: heroVideo.type, caption: heroVideo.caption, sortOrder: heroVideo.sortOrder } : null,
        galleryImages: galleryImages.map((m) => ({ id: m.id, url: m.url, type: m.type, caption: m.caption, sortOrder: m.sortOrder })),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMediaItem(req, res, next) {
  try {
    const id = req.params.id;
    await database.propertyMedia.delete({ where: { id } });
    res.json({ success: true, message: 'Media deleted.' });
  } catch (error) {
    next(error);
  }
}

export async function createMediaItem(req, res, next) {
  try {
    const { propertyId, type, caption } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { uploadFile } = await import('../services/upload.service.js');
    const result = await uploadFile(file, { folder: 'property-vision/properties' });

    const lastItem = await database.propertyMedia.findFirst({
      where: { propertyId },
      orderBy: { sortOrder: 'desc' },
    });

    const record = await database.propertyMedia.create({
      data: {
        propertyId,
        type,
        url: result.url,
        caption: caption ?? null,
        sortOrder: (lastItem?.sortOrder ?? -1) + 1,
      },
    });

    res.status(201).json({
      success: true,
      data: { id: record.id, url: record.url, type: record.type, caption: record.caption, sortOrder: record.sortOrder },
    });
  } catch (error) {
    next(error);
  }
}

export async function visitStats(req, res, next) {
  try {
    const now = Date.now();

    const daily = [];
    for (let i = 29; i >= 0; i--) {
      const dayStart = new Date(now - i * 24 * 60 * 60 * 1000);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      const count = await database.pageVisit.count({
        where: { createdAt: { gte: dayStart, lt: dayEnd } },
      });
      daily.push({ date: dayStart.toISOString().slice(0, 10), count });
    }

    const monthly = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const count = await database.pageVisit.count({
        where: { createdAt: { gte: monthStart, lt: monthEnd } },
      });
      monthly.push({
        month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        count,
      });
    }

    const allVisits = await database.pageVisit.findMany({
      select: { createdAt: true },
    });
    const yearMap = new Map();
    for (const v of allVisits) {
      const year = v.createdAt.getFullYear().toString();
      yearMap.set(year, (yearMap.get(year) ?? 0) + 1);
    }
    const yearly = Array.from(yearMap.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year));

    res.json({
      success: true,
      data: {
        daily,
        monthly,
        yearly,
        total30d: daily.reduce((sum, d) => sum + d.count, 0),
      },
    });
  } catch (error) {
    next(error);
  }
}
