import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { corsOptions } from './config/cors.js';
import { database } from './config/database.js';
import { env } from './config/env.js';

import { authRoutes } from './routes/auth.routes.js';
import { propertyRoutes } from './routes/property.routes.js';
import { leadRoutes } from './routes/lead.routes.js';
import { adminRoutes } from './routes/admin.routes.js';
import { propertyPageRoutes } from './routes/property-page.routes.js';
import { uploadRoutes } from './routes/upload.routes.js';
import { homepageRoutes } from './routes/homepage.routes.js';
import { bannerRoutes } from './routes/banner.routes.js';
import { pageVisitRoutes } from './routes/page-visit.routes.js';
import { contactSubmissionRoutes } from './routes/contact-submission.routes.js';
import { plotRoutes } from './routes/plot.routes.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/error.middleware.js';

export const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use(morgan('dev'));
app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/health', async (_req, res) => {
  try {
    await database.$queryRaw`SELECT 1`;
    const storage = env.R2_ENDPOINT && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY
      ? 'configured'
      : 'not-configured';
    res.json({ success: true, message: 'OK', database: 'connected', storage });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/property-page', propertyPageRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/page-visits', pageVisitRoutes);
app.use('/api/contact-submissions', contactSubmissionRoutes);
app.use('/api/plots', plotRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
