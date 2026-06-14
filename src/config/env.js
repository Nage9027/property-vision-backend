import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? 'change-me',
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET ?? process.env.JWT_SECRET ?? 'change-me-refresh',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  R2_ENDPOINT: process.env.R2_ENDPOINT ?? '',
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ?? '',
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY ?? '',
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME ?? '',
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL ?? '',
};
