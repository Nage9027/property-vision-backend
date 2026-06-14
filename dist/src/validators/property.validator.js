import { z } from 'zod';
const mediaSchema = z.object({
    type: z.string().min(1),
    url: z.string().url(),
    caption: z.string().optional().nullable(),
    sortOrder: z.coerce.number().int().nonnegative().optional(),
});
export const propertyStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'SOLD', 'RENTED']);
export const propertyCreateSchema = z.object({
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
export const propertyUpdateSchema = propertyCreateSchema.partial();
export const propertyHeroSchema = z.object({
    headline: z.string().min(3),
    subheadline: z.string().min(3),
    videoUrl: z.string().url().optional().nullable(),
    bannerImageUrl: z.string().url().optional().nullable(),
    ctaLabel: z.string().min(1).optional().nullable(),
    ctaHref: z.string().url().optional().nullable(),
    featuredPropertyId: z.string().min(1).optional().nullable(),
});
export const propertyParamsSchema = z.object({
    id: z.string().min(1),
});
