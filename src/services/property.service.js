import { Prisma } from '@prisma/client';
import { database } from '../config/database.js';
import { slugify } from '../utils/slug.utils.js';
function toDecimal(value) {
    if (value === undefined || value === null || value === '')
        return undefined;
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
        media: (property.media ?? [])
            .slice()
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((media) => ({
                id: media.id,
                type: media.type,
                url: media.url,
                caption: media.caption,
                sortOrder: media.sortOrder,
            })),
        amenities: Array.isArray(property.amenities)
            ? property.amenities.map((amenity) => amenity.name)
            : typeof property.amenities === 'string'
                ? [property.amenities]
                : [],
        district: property.district,
        state: property.state,
        landmark: property.landmark,
        googleMapUrl: property.googleMapUrl,
        totalPlots: property.totalPlots,
        availableUnits: property.availableUnits,
        distanceToORR: property.distanceToORR,
        internalRoadWidth: property.internalRoadWidth,
        expectedROI: property.expectedROI,
        phoneNumber: property.phoneNumber,
        whatsappNumber: property.whatsappNumber,
        email: property.email,
        investmentOverview: property.investmentOverview ?? null,
        investmentBenefits: property.investmentBenefits ?? null,
        locationAdvantages: property.locationAdvantages ?? null,
        testimonials: property.testimonials ?? null,
        faqs: property.faqs ?? null,
        siteVisitBenefits: property.siteVisitBenefits ?? null,
        contactInformation: property.contactInformation ?? null,
        footerInformation: property.footerInformation ?? null,
        customSections: property.customSections ?? null,
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
        btn1Label: property.btn1Label,
        btn1Type: property.btn1Type,
        btn1Url: property.btn1Url,
        btn2Label: property.btn2Label,
        btn2Type: property.btn2Type,
        btn2Url: property.btn2Url,
        btn3Label: property.btn3Label,
        btn3Type: property.btn3Type,
        btn3Url: property.btn3Url,
        metaTitle: property.metaTitle,
        metaDescription: property.metaDescription,
        ogImageUrl: property.ogImageUrl,
        keywords: property.keywords,
        homepageStatus: property.homepageStatus,
        seoTitle: property.seoTitle,
        seoDescription: property.seoDescription,
    };
}
function serializeHero(hero) {
    if (!hero)
        return null;
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
async function buildPropertyRecord(id, client = database) {
    return client.property.findUnique({
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
function asString(value) {
    if (Array.isArray(value))
        return value[0];
    return value == null ? '' : String(value);
}
function buildPropertyListWhere(query, includeHidden) {
    const conditions = [];
    const q = asString(query.q).trim();
    if (q) {
        conditions.push({
            OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { city: { contains: q, mode: 'insensitive' } },
                { locality: { contains: q, mode: 'insensitive' } },
                { district: { contains: q, mode: 'insensitive' } },
                { propertyType: { contains: q, mode: 'insensitive' } },
            ],
        });
    }
    const city = asString(query.city);
    if (city)
        conditions.push({ city });
    const district = asString(query.district);
    if (district)
        conditions.push({ district });
    const type = asString(query.type);
    if (type)
        conditions.push({ propertyType: type });
    const possession = asString(query.possession);
    if (possession)
        conditions.push({ possessionStatus: possession });
    const status = asString(query.status);
    if (status)
        conditions.push({ status });
    else if (!includeHidden)
        conditions.push({ status: 'PUBLISHED' });
    const bedroomsRaw = asString(query.bedrooms);
    const bedrooms = Number(bedroomsRaw);
    if (bedroomsRaw !== '' && Number.isInteger(bedrooms) && bedrooms > 0)
        conditions.push({ bedrooms });
    const priceMinRaw = asString(query.priceMin);
    const priceMin = Number(priceMinRaw);
    if (priceMinRaw !== '' && !Number.isNaN(priceMin))
        conditions.push({ price: { gte: priceMin } });
    const priceMaxRaw = asString(query.priceMax);
    const priceMax = Number(priceMaxRaw);
    if (priceMaxRaw !== '' && !Number.isNaN(priceMax))
        conditions.push({ price: { lte: priceMax } });
    return conditions.length ? { AND: conditions } : undefined;
}
function buildPropertyListOrder(query) {
    switch (asString(query.sort)) {
        case 'price-asc':
            return [{ price: 'asc' }];
        case 'price-desc':
            return [{ price: 'desc' }];
        case 'oldest':
            return [{ createdAt: 'asc' }];
        case 'title-asc':
            return [{ title: 'asc' }];
        case 'newest':
        default:
            return [{ featured: 'desc' }, { createdAt: 'desc' }];
    }
}
async function queryProperties(query, includeHidden) {
    const where = buildPropertyListWhere(query ?? {}, includeHidden);
    const orderBy = buildPropertyListOrder(query ?? {});
    const page = Math.max(1, Number.parseInt(asString(query?.page) || '1', 10) || 1);
    const rawLimit = Number.parseInt(asString(query?.limit) || '', 10);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(100, rawLimit) : null;
    const [total, rows] = await Promise.all([
        database.property.count({ where }),
        database.property.findMany({
            where,
            orderBy,
            include: { media: true, amenities: true },
            ...(limit ? { skip: (page - 1) * limit, take: limit } : {}),
        }),
    ]);
    const data = rows.map(serializeProperty);
    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: limit ? Math.max(1, Math.ceil(total / limit)) : 1,
        },
    };
}
export async function listPublishedProperties(query = {}) {
    return queryProperties(query, false);
}
export async function listAllProperties(query = {}) {
    return queryProperties(query, true);
}
export async function getPropertyByIdentifier(identifier, includeHidden = false) {
    const property = await findPropertyRecord(identifier, includeHidden);
    return property ? serializeProperty(property) : null;
}
function buildScalarFields(input) {
    const trim = (v) => (v === undefined || v === null || v === '' ? null : String(v).trim());
    const undefOrTrim = (v) => (v === undefined ? undefined : trim(v));
    const undefOrJson = (v) => (v === undefined ? undefined : v ?? null);
    return {
        locality: undefOrTrim(input.locality),
        address: undefOrTrim(input.address),
        propertyType: undefOrTrim(input.propertyType),
        description: undefOrTrim(input.description),
        possessionStatus: undefOrTrim(input.possessionStatus),
        isHomepageHero: input.isHomepageHero === undefined ? undefined : Boolean(input.isHomepageHero),
        heroTitle: undefOrTrim(input.heroTitle),
        heroSubtitle: undefOrTrim(input.heroSubtitle),
        heroDescription: undefOrTrim(input.heroDescription),
        heroVideoUrl: undefOrTrim(input.heroVideoUrl),
        heroImageUrl: undefOrTrim(input.heroImageUrl),
        startingPrice: undefOrTrim(input.startingPrice),
        priceUnit: undefOrTrim(input.priceUnit),
        offerBadge: undefOrTrim(input.offerBadge),
        priceHighlight: undefOrTrim(input.priceHighlight),
        district: undefOrTrim(input.district),
        state: undefOrTrim(input.state),
        googleMapUrl: undefOrTrim(input.googleMapUrl),
        landmark: undefOrTrim(input.landmark),
        totalPlots: undefOrTrim(input.totalPlots),
        availableUnits: undefOrTrim(input.availableUnits),
        distanceToORR: undefOrTrim(input.distanceToORR),
        internalRoadWidth: undefOrTrim(input.internalRoadWidth),
        btn1Label: undefOrTrim(input.btn1Label),
        btn1Type: undefOrTrim(input.btn1Type),
        btn1Url: undefOrTrim(input.btn1Url),
        btn2Label: undefOrTrim(input.btn2Label),
        btn2Type: undefOrTrim(input.btn2Type),
        btn2Url: undefOrTrim(input.btn2Url),
        btn3Label: undefOrTrim(input.btn3Label),
        btn3Type: undefOrTrim(input.btn3Type),
        btn3Url: undefOrTrim(input.btn3Url),
        whatsappNumber: undefOrTrim(input.whatsappNumber),
        phoneNumber: undefOrTrim(input.phoneNumber),
        metaTitle: undefOrTrim(input.metaTitle),
        metaDescription: undefOrTrim(input.metaDescription),
        ogImageUrl: undefOrTrim(input.ogImageUrl),
        keywords: undefOrTrim(input.keywords),
        homepageStatus: undefOrTrim(input.homepageStatus),
        expectedROI: undefOrTrim(input.expectedROI),
        seoTitle: undefOrTrim(input.seoTitle),
        seoDescription: undefOrTrim(input.seoDescription),
        investmentOverview: undefOrJson(input.investmentOverview),
        investmentBenefits: undefOrJson(input.investmentBenefits),
        locationAdvantages: undefOrJson(input.locationAdvantages),
        testimonials: undefOrJson(input.testimonials),
        faqs: undefOrJson(input.faqs),
        siteVisitBenefits: undefOrJson(input.siteVisitBenefits),
        contactInformation: undefOrJson(input.contactInformation),
        footerInformation: undefOrJson(input.footerInformation),
        customSections: undefOrJson(input.customSections),
    };
}
export async function createProperty(input) {
    const slug = await ensureUniqueSlug(input.title);
    const property = await database.$transaction(async (tx) => {
        const created = await tx.property.create({
            data: {
                title: input.title.trim(),
                slug,
                city: input.city.trim(),
                price: toDecimal(input.price),
                status: input.status ?? 'DRAFT',
                featured: input.featured ?? false,
                bedrooms: input.bedrooms ?? null,
                bathrooms: input.bathrooms ?? null,
                area: input.area ?? null,
                ...buildScalarFields(input),
            },
        });
        await replaceCollections(tx, created.id, input.media, input.amenities);
        return buildPropertyRecord(created.id, tx);
    });
    if (!property)
        throw new Error('Failed to create property.');
    return serializeProperty(property);
}
export async function updateProperty(identifier, input) {
    const existing = await findPropertyRecord(identifier, true);
    if (!existing)
        return null;
    const property = await database.$transaction(async (tx) => {
        await tx.property.update({
            where: { id: existing.id },
            data: {
                title: input.title?.trim(),
                city: input.city?.trim(),
                price: input.price === undefined ? undefined : toDecimal(input.price),
                status: input.status,
                featured: input.featured,
                bedrooms: input.bedrooms === undefined ? undefined : input.bedrooms,
                bathrooms: input.bathrooms === undefined ? undefined : input.bathrooms,
                area: input.area === undefined ? undefined : input.area,
                ...buildScalarFields(input),
            },
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
    if (!property)
        return null;
    const updated = await database.property.update({
        where: { id: property.id },
        data: { status },
        include: { media: true, amenities: true },
    });
    return serializeProperty(updated);
}
export async function deleteProperty(identifier) {
    const property = await database.property.findFirst({
        where: { OR: [{ id: identifier }, { slug: identifier }] },
        select: { id: true },
    });
    if (!property)
        return null;
    await database.property.delete({ where: { id: property.id } });
    return { id: property.id };
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
export async function getPropertyMedia(slug) {
  const property = await database.property.findFirst({
    where: { slug },
    include: { media: true },
  });
  if (!property) return null;

  const sorted = property.media.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    photos: sorted.filter((m) => m.type === 'image' || m.type === 'photo'),
    videos: sorted.filter((m) => m.type === 'video'),
    masterPlans: sorted.filter((m) => m.type === 'master-plan' || m.type === 'masterplan'),
    droneViews: sorted.filter((m) => m.type === 'drone-view' || m.type === 'drone'),
  };
}

export async function getPropertyPageHero() {
    let hero = (await database.propertyPageHero.findFirst({
        include: {
            featuredProperty: {
                include: { media: true, amenities: true },
            },
        },
        orderBy: { updatedAt: 'desc' },
    }));
    if (!hero) {
        hero = (await database.propertyPageHero.create({
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
        }));
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

export async function getAdminPropertyMedia(propertyId) {
  const items = await database.propertyMedia.findMany({
    where: { propertyId },
    orderBy: { sortOrder: 'asc' },
  });
  return {
    bannerImage: items.find((m) => m.type === 'banner-image') ?? null,
    masterPlan: items.find((m) => m.type === 'master-plan' || m.type === 'masterplan') ?? null,
    heroVideo: items.find((m) => m.type === 'video') ?? null,
    galleryImages: items.filter((m) => m.type === 'image' || m.type === 'photo'),
  };
}

export async function deletePropertyMedia(mediaId) {
  return database.propertyMedia.delete({ where: { id: mediaId } });
}

export async function createPropertyMedia(propertyId, type, url, caption) {
  const result = await database.propertyMedia.aggregate({
    where: { propertyId },
    _max: { sortOrder: true },
  });
  const nextOrder = (result._max.sortOrder ?? -1) + 1;
  return database.propertyMedia.create({
    data: { propertyId, type, url, caption: caption ?? null, sortOrder: nextOrder },
  });
}
