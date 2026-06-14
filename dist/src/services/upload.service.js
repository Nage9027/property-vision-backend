import { Readable } from 'node:stream';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
function inferResourceType(mimeType) {
    if (mimeType.startsWith('video/'))
        return 'video';
    return 'image';
}
export async function uploadFile(file, options = { folder: 'property-vision' }) {
    if (!isCloudinaryConfigured()) {
        const error = new Error('Cloudinary is not configured.');
        error.status = 500;
        throw error;
    }
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
export async function uploadFiles(files, options = { folder: 'property-vision' }) {
    return Promise.all(files.map((file) => uploadFile(file, options)));
}
