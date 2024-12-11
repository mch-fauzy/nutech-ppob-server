import {
    v2 as cloudinary,
    UploadApiResponse,
    UploadApiErrorResponse
} from 'cloudinary';
import { StatusCodes } from 'http-status-codes';

import { CONFIG } from '../../configs/config';
import { Failure } from '../../utils/failure';
import { logger } from '../../configs/winston';
import { CloudinaryUploadImageRequest } from '../../models/dto/externals/cloudinary-dto';


class CloudinaryService {
    /**
    * Configures the Cloudinary client with credentials from the configuration file
    */
    private static config() {
        cloudinary.config({
            cloud_name: CONFIG.CLOUDINARY.CLOUD_NAME,
            api_key: CONFIG.CLOUDINARY.API_KEY,
            api_secret: CONFIG.CLOUDINARY.API_SECRET,
            secure: true,
        });
    };

    /**
    * Uploads an image buffer to Cloudinary with specified options
    */
    static uploadImage = async (req: CloudinaryUploadImageRequest): Promise<UploadApiResponse> => {
        try {
            this.config();

            const uploadImageOptions = {
                folder: CONFIG.CLOUDINARY.IMAGE_STORAGE_DIRECTORY!,
                filename_override: req.fileName,
                unique_filename: false,
                use_filename: true,
            };

            // Upload the buffer as a base64 string or URL
            const base64Image = `data:${req.mimeType};base64,${req.buffer.toString('base64')}`;
            const response = await cloudinary.uploader.upload(
                base64Image,
                uploadImageOptions
            );

            return response;
        } catch (error) {
            const cloudinaryError = error as UploadApiErrorResponse;

            if (cloudinaryError.http_code === StatusCodes.UNAUTHORIZED) {
                logger.error(`[CloudinaryService.uploadImage] ${cloudinaryError.message}`);
                throw Failure.unauthorized('Invalid Cloudinary signature');
            }

            logger.error(`[CloudinaryService.uploadImage] Error uploading image to Cloudinary: ${JSON.stringify(cloudinaryError)}`);
            throw Failure.internalServer('Failed to upload image to Cloudinary');
        }
    };
}

export { CloudinaryService };
