import { env } from './env.js';
const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());
export const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
