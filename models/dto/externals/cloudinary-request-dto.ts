/**
 * Request interface for Cloudinary image upload
 */
interface CloudinaryUploadImageRequest {
  fileName: string;
  buffer: Buffer;
  mimeType: string;
}

// /**
//  * Validator for Cloudinary-related requests
//  */
// class CloudinaryValidator {
//   /**
//    * Validator schema for image upload requests
//    */
//   private static uploadImageRequestValidator = Joi.object({
//     fileName: Joi.string().required(),
//     buffer: Joi.any()
//       .custom((value, helpers) => {
//         if (!(value instanceof Buffer)) return helpers.error('any.invalid');
//         return value;
//       })
//       .required(),
//     mimeType: Joi.string().required(),
//   });

//   /**
//    * Validates a Cloudinary image upload request
//    * @param req The request to validate
//    * @returns The validated request
//    */
//   static validateUploadImageRequest = async (
//     req: CloudinaryUploadImageRequest,
//   ): Promise<CloudinaryUploadImageRequest> => {
//     return await this.uploadImageRequestValidator.validateAsync(req);
//   };
// }

export {CloudinaryUploadImageRequest};
