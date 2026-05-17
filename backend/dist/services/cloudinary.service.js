import cloudinary from '../config/cloudinary.js';
import logger from '../utils/logger.js';
export class CloudinaryService {
    static DEFAULT_FOLDER = 'zimcart/products';
    static DEFAULT_TRANSFORMATIONS = [
        { width: 2000, height: 2000, crop: 'limit' },
        { quality: 'auto:good' },
        { format: 'webp' },
        { fetch_format: 'auto' },
        { flags: 'strip_profile' }
    ];
    static async uploadBuffer(buffer, folder = this.DEFAULT_FOLDER) {
        const options = {
            folder,
            resource_type: 'image',
            transformation: this.DEFAULT_TRANSFORMATIONS,
        };
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
                if (error) {
                    logger.error('Cloudinary Buffer Upload Failed', { error, folder });
                    return reject(new Error(`Storage service error: ${error.message}`));
                }
                if (!result)
                    return reject(new Error('Cloudinary returned null result'));
                resolve(this.mapUploadResponse(result));
            });
            uploadStream.end(buffer);
        });
    }
    static async uploadImage(source, folder = this.DEFAULT_FOLDER) {
        try {
            const result = await cloudinary.uploader.upload(source, {
                folder,
                resource_type: 'image',
                transformation: this.DEFAULT_TRANSFORMATIONS,
            });
            return this.mapUploadResponse(result);
        }
        catch (error) {
            logger.error('Cloudinary Source Upload Failed', { error: error.message, source });
            throw new Error('Failed to process image from source');
        }
    }
    static async deleteImage(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            const success = result.result === 'ok';
            if (!success) {
                logger.warn('Cloudinary Asset Deletion Unsuccessful', { publicId, result });
            }
            return success;
        }
        catch (error) {
            logger.error('Cloudinary Delete Error', { error: error.message, publicId });
            throw new Error('Storage deletion failed');
        }
    }
    static async deleteBatchImages(publicIds) {
        if (!publicIds?.length)
            return;
        try {
            const result = await cloudinary.api.delete_resources(publicIds);
            logger.info('Cloudinary Batch Deletion Completed', { status: result.deleted });
        }
        catch (error) {
            logger.error('Cloudinary Batch Delete Error', { error: error.message, publicIds });
            throw new Error('Mass storage deletion failed');
        }
    }
    static mapUploadResponse(result) {
        return {
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes
        };
    }
}
//# sourceMappingURL=cloudinary.service.js.map