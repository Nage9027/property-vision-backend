import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { r2, isR2Configured } from '../config/r2.js';
import { env } from '../config/env.js';
import { Readable } from 'node:stream';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

function inferResourceType(mimeType) {
    if (mimeType.startsWith('video/')) return 'video';
    return 'image';
}

export async function uploadFile(file, options = { folder: 'property-vision' }) {
    if (isR2Configured()) {
        const ext = extname(file.originalname) || '.bin';
        const key = `${options.folder}/${randomUUID()}${ext}`;
        const command = new PutObjectCommand({
            Bucket: env.R2_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        await r2.send(command);
        const url = `${env.R2_PUBLIC_URL}/${key}`;
        return {
            url,
            publicId: key,
            resourceType: inferResourceType(file.mimetype),
            bytes: file.size,
            originalFilename: file.originalname,
        };
    }

    if (isCloudinaryConfigured()) {
        const resourceType = options.resourceType ?? inferResourceType(file.mimetype);
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: options.folder,
                resource_type: resourceType,
            }, (error, result) => {
                if (error || !result) {
                    reject(error ?? new Error('Upload failed.'));
                    return;
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    resourceType: result.resource_type,
                    bytes: result.bytes,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    originalFilename: file.originalname,
                });
            });
            Readable.from(file.buffer).on('error', reject).pipe(uploadStream);
        });
    }

    const error = new Error('No upload provider configured. Set R2 or Cloudinary env vars.');
    error.status = 500;
    throw error;
}

export async function uploadFiles(files, options = { folder: 'property-vision' }) {
    return Promise.all(files.map((file) => uploadFile(file, options)));
}
