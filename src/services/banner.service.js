import { database } from '../config/database.js';

function serialize(banner) {
  return {
    ...banner,
    startDate: banner.startDate ? new Date(banner.startDate).toISOString() : null,
    endDate: banner.endDate ? new Date(banner.endDate).toISOString() : null,
  };
}

export async function listBanners() {
  const banners = await database.promotionalBanner.findMany({
    orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
  });
  return banners.map(serialize);
}

export async function getActiveBanner() {
  const now = new Date();
  const banner = await database.promotionalBanner.findFirst({
    where: {
      isActive: true,
      AND: [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ],
    },
    orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
  });
  return banner ? serialize(banner) : null;
}

export async function getBannerById(id) {
  const banner = await database.promotionalBanner.findUnique({ where: { id } });
  return banner ? serialize(banner) : null;
}

export async function createBanner(input) {
  const data = { ...input };
  if (input.startDate) data.startDate = new Date(input.startDate);
  if (input.endDate) data.endDate = new Date(input.endDate);

  const banner = await database.promotionalBanner.create({ data });
  return serialize(banner);
}

export async function updateBanner(id, input) {
  const data = { ...input };
  if (input.startDate !== undefined) {
    data.startDate = input.startDate ? new Date(input.startDate) : null;
  }
  if (input.endDate !== undefined) {
    data.endDate = input.endDate ? new Date(input.endDate) : null;
  }

  const banner = await database.promotionalBanner.update({
    where: { id },
    data,
  });
  return serialize(banner);
}

export async function deleteBanner(id) {
  await database.promotionalBanner.delete({ where: { id } });
  return { id };
}

export async function ensureSeedBanner() {
  const existing = await database.promotionalBanner.findFirst({ where: { isActive: true } });
  if (existing) return existing;

  const count = await database.promotionalBanner.count();
  if (count > 0) return null;

  return database.promotionalBanner.create({
    data: {
      title: '🏡 Luxury Plots Available Now',
      subtitle: 'Premium CRDA-approved plotted development with world-class amenities.',
      offerText: 'Limited Period Offer',
      price: '₹4,200 / Sq.Yd',
      location: 'Edara, Andhra Pradesh',
      ctaText: 'Explore Properties',
      ctaUrl: '/properties',
      bannerImage: '',
      popupType: 'CENTER_MODAL',
      animationType: 'SCALE',
      isActive: true,
      priority: 0,
      enableBlur: true,
      autoOpen: true,
      delayMs: 3000,
    },
  });
}
