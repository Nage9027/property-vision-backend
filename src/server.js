import { createServer } from 'node:http';
import { app } from './app.js';
import { env } from './config/env.js';
import { ensureSeedAdmin } from './services/auth.service.js';
import { ensureSeedBanner } from './services/banner.service.js';

async function start() {
  try {
    await ensureSeedAdmin();
    console.log('[SEED] Admin user verified/created');
  } catch (err) {
    console.error('[SEED] Admin seed failed — login will fail until users table exists:', err instanceof Error ? err.message : String(err));
  }

  try {
    await ensureSeedBanner();
    console.log('[SEED] Banner seed verified/created');
  } catch (err) {
    console.error('[SEED] Banner seed failed:', err instanceof Error ? err.message : String(err));
  }

  const server = createServer(app);
  server.listen(env.PORT, () => {
    console.log(`Backend listening on port ${env.PORT}`);
  });
}

start();
