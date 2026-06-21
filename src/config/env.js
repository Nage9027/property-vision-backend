import 'dotenv/config';

const jwtSecret = process.env.JWT_SECRET;
const refreshJwtSecret = process.env.REFRESH_JWT_SECRET || jwtSecret;

if (!jwtSecret || jwtSecret === 'change-me') {
  console.warn('[ENV] WARNING: JWT_SECRET is not set or using default value. Set JWT_SECRET in environment variables.');
}
if (!process.env.REFRESH_JWT_SECRET) {
  console.warn('[ENV] WARNING: REFRESH_JWT_SECRET is not set. Falling back to JWT_SECRET.');
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  DIRECT_URL: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  JWT_SECRET: jwtSecret ?? 'change-me',
  REFRESH_JWT_SECRET: refreshJwtSecret ?? 'change-me-refresh',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  R2_ENDPOINT: process.env.R2_ENDPOINT ?? '',
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ?? '',
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY ?? '',
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME ?? '',
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL ?? '',
};
