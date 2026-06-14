import { Prisma } from '@prisma/client';
import { database } from '../config/database.js';
import { slugify } from '../utils/slug.utils.js';

function toDecimal(value) {
  if (value === undefined || value === null || value === '') return undefined;
  return new Prisma.Decimal(value);
}

function serializeProperty(property) {
  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    city: property.city,
    locality: property.locality,
    address: property.address,
    price: property.price == null ? null : property.price.toString(),
    propertyType: property.propertyType,
    status: property.status,
    description: property.description,
    featured: property.featured,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    possessionStatus: property.possessionStatus,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
    media: property.media
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((media) => ({
        id: media.id,
        type: media.type,
        url: media.url,
        caption: media.caption,
        sortOrder: media.sortOrder,
      })),
    amenities: property.amenities.map((amenity) => amenity.name),
    isHomepageHero: property.isHomepageHero,
    heroTitle: property.heroTitle,
    heroSubtitle: property.heroSubtitle,
    heroDescription: property.heroDescription,
    heroVideoUrl: property.heroVideoUrl,
    heroImageUrl: property.heroImageUrl,
    startingPrice: property.startingPrice,
    priceUnit: property.priceUnit,
    offerBadge: property.offerBadge,
    priceHighlight: property.priceHighlight,
    district: property.district,
    state: property.state,
    googleMapUrl: property.googleMapUrl,
    landmark: property.landmark,
    totalPlots: property.totalPlots,
    availableUnits: property.availableUnits,
    distanceToORR: property.distanceToORR,
    internalRoadWidth: property.internalRoadWidth,
    btn1Label: property.btn1Label,
    btn1Type: property.btn1Type,
    btn1Url: property.btn1Url,
    btn2Label: property.btn2Label,
    btn2Type: property.btn2Type,
    btn2Url: property.btn2Url,
    btn3Label: property.btn3Label,
    btn3Type: property.btn3Type,
    btn3Url: property.btn3Url,
    whatsappNumber: property.whatsappNumber,
    phoneNumber: property.phoneNumber,
    metaTitle: property.metaTitle,
    metaDescription: property.metaDescription,
    ogImageUrl: property.ogImageUrl,
    keywords: property.keywords,
    homepageStatus: property.homepageStatus,
  };
}

function serializeHero(hero) {
  if (!hero) return null;
  return {
    id: hero.id,
    headline: hero.headline,
    subheadline: hero.subheadline,
    videoUrl: hero.videoUrl,
    bannerImageUrl: hero.bannerImageUrl,
    ctaLabel: hero.ctaLabel,
    ctaHref: hero.ctaHref,
    featuredPropertyId: hero.featuredPropertyId,
    featuredProperty: hero.featuredProperty ? serializeProperty(hero.featuredProperty) : null,
    updatedAt: hero.updatedAt,
    createdAt: hero.createdAt,
  };
}

async function ensureUniqueSlug(title) {
  const base = slugify(title);
  let candidate = base;
  let counter = 2;

  while (await database.property.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  return candidate;
}

async function findPropertyRecord(identifier, includeHidden = false) {
  return database.property.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
      ...(includeHidden ? {} : { status: 'PUBLISHED' }),
    },
    include: {
      media: true,
      amenities: true,
    },
  });
}

async function buildPropertyRecord(id, client) {
  const db = client ?? database;
  return db.property.findUnique({
    where: { id },
    include: {
      media: true,
      amenities: true,
    },
  });
}

async function replaceCollections(tx, propertyId, media, amenities) {
  if (media !== undefined) {
    await tx.propertyMedia.deleteMany({ where: { propertyId } });
    if (media.length) {
      await tx.propertyMedia.createMany({
        data: media.map((item, index) => ({
          propertyId,
          type: item.type,
          url: item.url,
          caption: item.caption ?? null,
          sortOrder: item.sortOrder ?? index,
        })),
      });
    }
  }

  if (amenities !== undefined) {
    await tx.amenity.deleteMany({ where: { propertyId } });
    if (amenities.length) {
      await tx.amenity.createMany({
        data: amenities.map((name) => ({ propertyId, name })),
      });
    }
  }
}

function buildUpdateData(input) {
  const data = {};
  const fields = [
    'title', 'city', 'locality', 'address', 'propertyType', 'description',
    'featured', 'bedrooms', 'bathrooms', 'area', 'possessionStatus',
    'isHomepageHero', 'heroTitle', 'heroSubtitle', 'heroDescription',
    'heroVideoUrl', 'heroImageUrl', 'startingPrice', 'priceUnit',
    'offerBadge', 'priceHighlight', 'district', 'state', 'googleMapUrl',
    'landmark', 'totalPlots', 'availableUnits', 'distanceToORR',
    'internalRoadWidth', 'btn1Label', 'btn1Type', 'btn1Url',
    'btn2Label', 'btn2Type', 'btn2Url', 'btn3Label', 'btn3Type', 'btn3Url',
    'whatsappNumber', 'phoneNumber', 'metaTitle', 'metaDescription',
    'ogImageUrl', 'keywords', 'homepageStatus',
  ];

  for (const key of fields) {
    if (input[key] !== undefined) {
      data[key] = input[key];
    }
  }

  if (input.price !== undefined) {
    data.price = toDecimal(input.price);
  }
  if (input.status !== undefined) {
    data.status = input.status;
  }

  return data;
}

export async function listPublishedProperties() {
  const properties = await database.property.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    include: { media: true, amenities: true },
  });
  return properties.map(serializeProperty);
}

export async function listAllProperties() {
  const properties = await database.property.findMany({
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    include: { media: true, amenities: true },
  });
  return properties.map(serializeProperty);
}

export async function getPropertyByIdentifier(identifier, includeHidden = false) {
  const property = await findPropertyRecord(identifier, includeHidden);
  return property ? serializeProperty(property) : null;
}

export async function createProperty(input) {
  const slug = await ensureUniqueSlug(input.title);

  const property = await database.$transaction(async (tx) => {
    const updateData = buildUpdateData(input);
    delete updateData.media;
    delete updateData.amenities;

    const created = await tx.property.create({
      data: {
        title: input.title.trim(),
        slug,
        city: input.city.trim(),
        ...updateData,
      },
    });

    await replaceCollections(tx, created.id, input.media, input.amenities);
    return buildPropertyRecord(created.id, tx);
  });

  if (!property) throw new Error('Failed to create property.');
  return serializeProperty(property);
}

export async function updateProperty(identifier, input) {
  const existing = await findPropertyRecord(identifier, true);
  if (!existing) return null;

  const property = await database.$transaction(async (tx) => {
    const updateData = buildUpdateData(input);
    delete updateData.media;
    delete updateData.amenities;

    await tx.property.update({
      where: { id: existing.id },
      data: updateData,
    });

    await replaceCollections(tx, existing.id, input.media, input.amenities);
    return buildPropertyRecord(existing.id, tx);
  });

  return property ? serializeProperty(property) : null;
}

export async function setPropertyStatus(identifier, status) {
  const property = await database.property.findFirst({
    where: { OR: [{ id: identifier }, { slug: identifier }] },
    include: { media: true, amenities: true },
  });

  if (!property) return null;
  const updated = await database.property.update({
    where: { id: property.id },
    data: { status },
    include: { media: true, amenities: true },
  });
  return serializeProperty(updated);
}

export async function getPropertyDashboardStats() {
  const [total, published, draft, heroCount, leadCount] = await Promise.all([
    database.property.count(),
    database.property.count({ where: { status: 'PUBLISHED' } }),
    database.property.count({ where: { status: 'DRAFT' } }),
    database.propertyPageHero.count(),
    database.lead.count(),
  ]);

  return { total, published, draft, heroCount, leadCount };
}

export async function getPropertyPageHero() {
  let hero = await database.propertyPageHero.findFirst({
    include: {
      featuredProperty: {
        include: { media: true, amenities: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  if (!hero) {
    hero = await database.propertyPageHero.create({
      data: {
        headline: 'Discover verified properties',
        subheadline: 'Browse published listings, hero media, and master plans from Property Vision.',
        ctaLabel: 'Browse Properties',
        ctaHref: '/properties',
      },
      include: {
        featuredProperty: {
          include: { media: true, amenities: true },
        },
      },
    });
  }

  return serializeHero(hero);
}

export async function updatePropertyPageHero(input) {
  if (input.featuredPropertyId) {
    const property = await database.property.findUnique({ where: { id: input.featuredPropertyId } });
    if (!property) {
      const error = new Error('Featured property not found.');
      error.status = 404;
      throw error;
    }
  }

  const existing = await database.propertyPageHero.findFirst();

  const hero = existing
    ? await database.propertyPageHero.update({
        where: { id: existing.id },
        data: {
          headline: input.headline.trim(),
          subheadline: input.subheadline.trim(),
          videoUrl: input.videoUrl?.trim() || null,
          bannerImageUrl: input.bannerImageUrl?.trim() || null,
          ctaLabel: input.ctaLabel?.trim() || null,
          ctaHref: input.ctaHref?.trim() || null,
          featuredPropertyId: input.featuredPropertyId?.trim() || null,
        },
        include: {
          featuredProperty: {
            include: { media: true, amenities: true },
          },
        },
      })
    : await database.propertyPageHero.create({
        data: {
          headline: input.headline.trim(),
          subheadline: input.subheadline.trim(),
          videoUrl: input.videoUrl?.trim() || null,
          bannerImageUrl: input.bannerImageUrl?.trim() || null,
          ctaLabel: input.ctaLabel?.trim() || null,
          ctaHref: input.ctaHref?.trim() || null,
          featuredPropertyId: input.featuredPropertyId?.trim() || null,
        },
        include: {
          featuredProperty: {
            include: { media: true, amenities: true },
          },
        },
      });

  return serializeHero(hero);
}

export async function getHomepageHero() {
  const property = await database.property.findFirst({
    where: { isHomepageHero: true, homepageStatus: 'PUBLISHED' },
    include: { media: true, amenities: true },
    orderBy: { updatedAt: 'desc' },
  });

  if (!property) {
    const fallback = await database.property.findFirst({
      where: { status: 'PUBLISHED' },
      include: { media: true, amenities: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });

    if (!fallback) return null;
    return serializeProperty(fallback);
  }

  return serializeProperty(property);
}

export async function setHomepageHero(propertyId, homepageStatus = 'PUBLISHED') {
  const property = await database.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    const error = new Error('Property not found.');
    error.status = 404;
    throw error;
  }

  await database.$transaction([
    database.property.updateMany({
      where: { isHomepageHero: true },
      data: { isHomepageHero: false },
    }),
    database.property.update({
      where: { id: propertyId },
      data: {
        isHomepageHero: true,
        homepageStatus,
      },
    }),
  ]);

  const updated = await database.property.findUnique({
    where: { id: propertyId },
    include: { media: true, amenities: true },
  });

  return serializeProperty(updated);
}
