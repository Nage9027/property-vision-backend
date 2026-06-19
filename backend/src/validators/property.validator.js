import { z } from 'zod';

const mediaSchema = z.object({
  type: z.string().min(1),
  url: z.string().min(1),
  caption: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
});

export const propertyStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'SOLD', 'RENTED']);

const homepageHeroFields = {
  isHomepageHero: z.coerce.boolean().optional(),
  heroTitle: z.string().min(1).optional().nullable(),
  heroSubtitle: z.string().min(1).optional().nullable(),
  heroDescription: z.string().min(1).optional().nullable(),
  heroVideoUrl: z.string().optional().nullable(),
  heroImageUrl: z.string().optional().nullable(),
  startingPrice: z.string().optional().nullable(),
  priceUnit: z.string().optional().nullable(),
  offerBadge: z.string().optional().nullable(),
  priceHighlight: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  googleMapUrl: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  totalPlots: z.string().optional().nullable(),
  availableUnits: z.string().optional().nullable(),
  distanceToORR: z.string().optional().nullable(),
  internalRoadWidth: z.string().optional().nullable(),
  btn1Label: z.string().optional().nullable(),
  btn1Type: z.enum(['internal', 'external', 'whatsapp', 'phone']).optional().nullable(),
  btn1Url: z.string().optional().nullable(),
  btn2Label: z.string().optional().nullable(),
  btn2Type: z.enum(['internal', 'external', 'whatsapp', 'phone']).optional().nullable(),
  btn2Url: z.string().optional().nullable(),
  btn3Label: z.string().optional().nullable(),
  btn3Type: z.enum(['internal', 'external', 'whatsapp', 'phone']).optional().nullable(),
  btn3Url: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImageUrl: z.string().optional().nullable(),
  keywords: z.string().optional().nullable(),
  homepageStatus: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
};

const baseCreateSchema = z.object({
  title: z.string().min(3),
  city: z.string().min(2),
  locality: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  price: z.coerce.number().optional().nullable(),
  propertyType: z.string().optional().nullable(),
  status: propertyStatusSchema.optional(),
  description: z.string().optional().nullable(),
  featured: z.coerce.boolean().optional(),
  bedrooms: z.coerce.number().int().nonnegative().optional().nullable(),
  bathrooms: z.coerce.number().int().nonnegative().optional().nullable(),
  area: z.coerce.number().int().nonnegative().optional().nullable(),
  possessionStatus: z.string().optional().nullable(),
  media: z.array(mediaSchema).optional(),
  amenities: z.array(z.string().min(1)).optional(),
});

const dynamicPageFields = {
  investmentOverview: z.any().optional().nullable(),
  expectedROI: z.string().optional().nullable(),
  investmentBenefits: z.array(z.any()).optional().nullable(),
  locationAdvantages: z.array(z.any()).optional().nullable(),
  testimonials: z.array(z.any()).optional().nullable(),
  faqs: z.array(z.any()).optional().nullable(),
  siteVisitBenefits: z.array(z.any()).optional().nullable(),
  contactInformation: z.any().optional().nullable(),
  footerInformation: z.any().optional().nullable(),
  customSections: z.array(z.any()).optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
};

export const propertyCreateSchema = baseCreateSchema.extend(homepageHeroFields).extend(dynamicPageFields);
export const propertyUpdateSchema = propertyCreateSchema.partial();

export const heroSetSchema = z.object({
  propertyId: z.string().min(1),
  homepageStatus: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

export const propertyHeroSchema = z.object({
  headline: z.string().min(3),
  subheadline: z.string().min(3),
  videoUrl: z.string().min(1).optional().nullable(),
  bannerImageUrl: z.string().min(1).optional().nullable(),
  ctaLabel: z.string().min(1).optional().nullable(),
  ctaHref: z.string().min(1).optional().nullable(),
  featuredPropertyId: z.string().min(1).optional().nullable(),
});

export const propertyParamsSchema = z.object({
  id: z.string().min(1),
});
