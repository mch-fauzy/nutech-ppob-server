import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiResponse,
} from 'cloudinary';

import {CONFIG} from '../../configs/config';
import type {CloudinaryUploadImageRequest} from '../../models/dto/externals/cloudinary-dto';
import {handleError} from '../../utils/error-handler';

/**
 * Service to interact with the Cloudinary API for image management
 */
class CloudinaryService {
  /**
   * Configures the Cloudinary client with credentials from the configuration file
   * This method is private and is invoked before performing any operation with Cloudinary
   */
  private static config = () => {
    cloudinary.config({
      cloud_name: CONFIG.CLOUDINARY.CLOUD_NAME,
      api_key: CONFIG.CLOUDINARY.API_KEY,
      api_secret: CONFIG.CLOUDINARY.API_SECRET,
      secure: true,
    });
  };

  /**
   * Determines whether the provided error is an instance of UploadApiErrorResponse
   * @param error The error object to check
   * @return True if the error is an UploadApiErrorResponse, otherwise false
   */
  private static isUploadApiErrorResponse = (
    error: unknown,
  ): error is UploadApiErrorResponse => {
    if (typeof error !== 'object' || error === null) return false;

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
  static uploadImage = async (
    req: CloudinaryUploadImageRequest,
  ): Promise<UploadApiResponse> => {
    try {
      this.config();

      const uploadImageOptions = {
        folder: CONFIG.CLOUDINARY.IMAGE_STORAGE_DIRECTORY!,
        filename_override: req.fileName,
        unique_filename: false,
        use_filename: true,
      };

      // Convert the image buffer to a base64-encoded string
      const base64Image = `data:${req.mimeType};base64,${req.buffer.toString('base64')}`;

      // Upload the image to Cloudinary
      const response = await cloudinary.uploader.upload(
        base64Image,
        uploadImageOptions,
      );

      return response;
    } catch (error) {
      throw handleError({
        operationName: 'CloudinaryService.uploadImage',
        error,
      });
    }
  };
}

export {CloudinaryService};
