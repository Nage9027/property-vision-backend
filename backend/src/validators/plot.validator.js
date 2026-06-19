import { z } from 'zod';

const facingSchema = z.enum(['EAST', 'WEST', 'NORTH', 'SOUTH']);
const plotStatusSchema = z.enum(['AVAILABLE', 'SOLD', 'RESERVED']);

export const plotCreateSchema = z.object({
  plotNumber: z.string().min(1, 'Plot number is required'),
  facing: facingSchema,
  sizeSqYds: z.coerce.number().positive('Size must be positive'),
  roadWidth: z.string().optional().nullable(),
  status: plotStatusSchema.optional().default('AVAILABLE'),
  pricePerSqYd: z.coerce.number().optional().nullable(),
  isCorner: z.coerce.boolean().optional().default(false),
  isCommercialFacing: z.coerce.boolean().optional().default(false),
  isParkFacing: z.coerce.boolean().optional().default(false),
  features: z.string().optional().nullable(),
});

export const plotUpdateSchema = plotCreateSchema.partial();

export const plotBulkCreateSchema = z.object({
  plots: z.array(plotCreateSchema).min(1),
});
