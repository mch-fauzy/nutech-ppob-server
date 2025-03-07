"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = require("../../configs/config");
const error_handler_1 = require("../../utils/error-handler");
/**
 * Service to interact with the Cloudinary API for image management
 */
class CloudinaryService {
    /**
     * Configures the Cloudinary client with credentials from the configuration file
     * This method is private and is invoked before performing any operation with Cloudinary
     */
    static config = () => {
        cloudinary_1.v2.config({
            cloud_name: config_1.CONFIG.CLOUDINARY.CLOUD_NAME,
            api_key: config_1.CONFIG.CLOUDINARY.API_KEY,
            api_secret: config_1.CONFIG.CLOUDINARY.API_SECRET,
            secure: true,
        });
    };
    /**
     * Determines whether the provided error is an instance of UploadApiErrorResponse
     * @param error The error object to check
     * @return True if the error is an UploadApiErrorResponse, otherwise false
     */
    static isUploadApiErrorResponse = (error) => {
        if (typeof error !== 'object' || error === null)
            return false;
        const hasHttpCodeProperty = 'http_code' in error && !('stack' in error);
        const hasErrorProperty = 'error' in error;
        return hasHttpCodeProperty || hasErrorProperty;
    };
    /**
     * Uploads an image buffer to Cloudinary with specified options
     * @param fileName The name of the file to be uploaded
     * @param mimeType The MIME type of the image file
     * @param buffer The image data as a buffer
     * @return The response from Cloudinary containing details of the uploaded image
     * @throws Throws an internal server error for unexpected issues or a specific error for Cloudinary-related problems
     */
    static uploadImage = async (req) => {
        try {
            this.config();
            const uploadImageOptions = {
                folder: config_1.CONFIG.CLOUDINARY.IMAGE_STORAGE_DIRECTORY,
                filename_override: req.fileName,
                unique_filename: false,
                use_filename: true,
            };
            // Convert the image buffer to a base64-encoded string
            const base64Image = `data:${req.mimeType};base64,${req.buffer.toString('base64')}`;
            // Upload the image to Cloudinary
            const response = await cloudinary_1.v2.uploader.upload(base64Image, uploadImageOptions);
            return response;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'CloudinaryService.uploadImage',
                error,
            });
        }
    };
}
exports.CloudinaryService = CloudinaryService;
//# sourceMappingURL=cloudinary-service.js.map