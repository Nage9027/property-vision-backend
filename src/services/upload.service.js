import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';

// ── Singleton R2 Client ──────────────────────────────────────────────────────
let r2Client = null;

export function getR2Client() {
  if (r2Client) return r2Client;

  if (!env.R2_ENDPOINT || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    console.warn('[R2] Cloudflare R2 is not configured — missing endpoint or credentials.');
    return null;
  }

  r2Client = new S3Client({
    region: 'auto',
    endpoint: env.R2_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
    requestHandler: {
      requestTimeout: 60000,
    },
    forcePathStyle: false,
  });

  console.log('[R2] S3Client initialized for Cloudflare R2:', env.R2_ENDPOINT);
  return r2Client;
}

function checkR2Config() {
  const missing = [];
  if (!env.R2_ENDPOINT) missing.push('R2_ENDPOINT');
  if (!env.R2_ACCESS_KEY_ID) missing.push('R2_ACCESS_KEY_ID');
  if (!env.R2_SECRET_ACCESS_KEY) missing.push('R2_SECRET_ACCESS_KEY');
  if (!env.R2_BUCKET_NAME) missing.push('R2_BUCKET_NAME');

  if (missing.length > 0) {
    throw new Error(`R2 configuration incomplete — missing: ${missing.join(', ')}`);
  }
}

// ── Upload to Cloudflare R2 ──────────────────────────────────────────────────
async function uploadToR2(file, folder) {
  checkR2Config();

  const client = getR2Client();
  if (!client) {
    throw new Error('R2 client is not initialized. Check Cloudflare R2 environment variables.');
  }

  const ext = (file.originalname || 'file').split('.').pop() || 'bin';
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const key = `${folder}/${timestamp}-${random}.${ext}`;

  const buffer = file.buffer;

  console.log(`[R2] Uploading: key="${key}", bytes=${buffer.length}, type="${file.mimetype}"`);

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.mimetype || 'application/octet-stream',
    ContentLength: buffer.length,
  });

  await client.send(command);

  const baseUrl = (env.R2_PUBLIC_URL || env.R2_ENDPOINT).replace(/\/$/, '');
  const publicUrl = `${baseUrl}/${key}`;

  console.log(`[R2] Upload successful: ${publicUrl}`);

  return {
    url: publicUrl,
    key,
    bytes: buffer.length,
    originalFilename: file.originalname,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function uploadFile(file, options = {}) {
  if (!file || !file.buffer) {
    throw new Error('No file buffer provided. Ensure multer.memoryStorage() is configured.');
  }

  const folder = options.folder ?? 'property-vision';
  return uploadToR2(file, folder);
}

export async function uploadFiles(files, options = {}) {
  if (!files || files.length === 0) {
    throw new Error('No files to upload.');
  }
  console.log(`[R2] Starting batch upload of ${files.length} file(s)`);
  const results = await Promise.all(
    files.map((file) => uploadFile(file, options)),
  );
  console.log(`[R2] Batch upload complete: ${results.length} file(s)`);
  return results;
}
