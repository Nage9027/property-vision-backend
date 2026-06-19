import { createServer } from 'node:http';
import { app } from './app.js';
import { env } from './config/env.js';
import { ensureSeedAdmin } from './services/auth.service.js';
import { ensureSeedBanner } from './services/banner.service.js';

const server = createServer(app);

Promise.all([ensureSeedAdmin(), ensureSeedBanner()])
  .then(() => {
    server.listen(env.PORT, () => {
      console.log(`Backend listening on port ${env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to seed:', err);
    server.listen(env.PORT, () => {
      console.log(`Backend listening on port ${env.PORT} (seed failed)`);
    });
  });
