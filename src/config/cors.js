import { env } from './env.js';

function parseOrigin(raw) {
  const trimmed = raw.trim();
  if (!trimmed.includes(',')) return trimmed;
  return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
}

export const corsOptions = {
  origin: parseOrigin(env.CORS_ORIGIN),
  credentials: true,
};
