import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { env } from '../config/env.js';

let r2Client = null;

export function getR2Client() {
  if (!r2Client && env.R2_ENDPOINT && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY) {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
      requestHandler: {
        requestTimeout: 30000,
      },
    });
  }
  return r2Client;
}

function isR2Configured() {
  return Boolean(env.R2_ENDPOINT && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET_NAME);
}

async function uploadToR2(file, folder) {
  const client = getR2Client();
  const ext = file.originalname.split('.').pop() || 'bin';
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    Body: Readable.from(file.buffer),
    ContentType: file.mimetype,
  });

  await client.send(command);

  const publicUrl = env.R2_PUBLIC_URL
    ? `${env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
    : `${env.R2_ENDPOINT.replace(/\/$/, '')}/${env.R2_BUCKET_NAME}/${key}`;

  return { url: publicUrl, key, bytes: file.size, originalFilename: file.originalname };
}

async function uploadToLocal(file, folder) {
  const uploadDir = join(process.cwd(), 'public', 'assets', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });

  const ext = file.originalname.split('.').pop() || 'bin';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filepath = join(uploadDir, filename);

  await writeFile(filepath, file.buffer);

  const url = `/assets/uploads/${folder}/${filename}`;
  return { url, key: filename, bytes: file.size, originalFilename: file.originalname };
}

export async function uploadFile(file, options = {}) {
  const folder = options.folder ?? 'property-vision';

  if (isR2Configured()) {
    try {
      return await uploadToR2(file, folder);
    } catch (r2Error) {
      console.warn('R2 upload failed, falling back to local storage:', r2Error.message);
    }
  }

  return await uploadToLocal(file, folder);
}

export async function uploadFiles(files, options = {}) {
  return Promise.all(files.map((file) => uploadFile(file, options)));
}
