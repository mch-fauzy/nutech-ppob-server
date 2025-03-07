import { type UploadApiResponse } from 'cloudinary';
import type { CloudinaryUploadImageRequest } from '../../models/dto/externals/cloudinary-dto';
/**
 * Service to interact with the Cloudinary API for image management
 */
declare class CloudinaryService {
    /**
     * Configures the Cloudinary client with credentials from the configuration file
     * This method is private and is invoked before performing any operation with Cloudinary
     */
    private static config;
    /**
     * Determines whether the provided error is an instance of UploadApiErrorResponse
     * @param error The error object to check
     * @return True if the error is an UploadApiErrorResponse, otherwise false
     */
    private static isUploadApiErrorResponse;
    /**
     * Uploads an image buffer to Cloudinary with specified options
     * @param fileName The name of the file to be uploaded
     * @param mimeType The MIME type of the image file
     * @param buffer The image data as a buffer
     * @return The response from Cloudinary containing details of the uploaded image
     * @throws Throws an internal server error for unexpected issues or a specific error for Cloudinary-related problems
     */
    static uploadImage: (req: CloudinaryUploadImageRequest) => Promise<UploadApiResponse>;
}
export { CloudinaryService };
