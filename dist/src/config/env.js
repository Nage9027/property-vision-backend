import 'dotenv/config';
export const env = {
    PORT: Number(process.env.PORT ?? 4000),
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    JWT_SECRET: process.env.JWT_SECRET ?? 'change-me',
    REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET ?? process.env.JWT_SECRET ?? 'change-me-refresh',
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? '',
};
