import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  requirement: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  whatsappOptIn: z.coerce.boolean().optional(),
  sourcePage: z.string().optional().nullable(),
});
