/// <reference types="node" />
/// <reference types="node" />
/**
 * Request interface for Cloudinary image upload
 */
interface CloudinaryUploadImageRequest {
    fileName: string;
    buffer: Buffer;
    mimeType: string;
}
export { CloudinaryUploadImageRequest };
