"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const http_status_codes_1 = require("http-status-codes");
const config_1 = require("../../configs/config");
const failure_1 = require("../../utils/failure");
const winston_1 = require("../../configs/winston");
class CloudinaryService {
    /**
    * Configures the Cloudinary client with credentials from the configuration file
    */
    static config() {
        cloudinary_1.v2.config({
            cloud_name: config_1.CONFIG.CLOUDINARY.CLOUD_NAME,
            api_key: config_1.CONFIG.CLOUDINARY.API_KEY,
            api_secret: config_1.CONFIG.CLOUDINARY.API_SECRET,
            secure: true,
        });
    }
    ;
}
exports.CloudinaryService = CloudinaryService;
_a = CloudinaryService;
/**
* Uploads an image buffer to Cloudinary with specified options
*/
CloudinaryService.uploadImage = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        _a.config();
        const uploadImageOptions = {
            folder: config_1.CONFIG.CLOUDINARY.IMAGE_STORAGE_DIRECTORY,
            filename_override: req.fileName,
            unique_filename: false,
            use_filename: true,
        };
        // Upload the buffer as a base64 string or URL
        const base64Image = `data:${req.mimeType};base64,${req.buffer.toString('base64')}`;
        const response = yield cloudinary_1.v2.uploader.upload(base64Image, uploadImageOptions);
        return response;
    }
    catch (error) {
        const cloudinaryError = error;
        if (cloudinaryError.http_code === http_status_codes_1.StatusCodes.UNAUTHORIZED) {
            winston_1.logger.error(`[CloudinaryService.uploadImage] ${cloudinaryError.message}`);
            throw failure_1.Failure.unauthorized('Invalid Cloudinary signature');
        }
        winston_1.logger.error(`[CloudinaryService.uploadImage] Error uploading image to Cloudinary: ${JSON.stringify(cloudinaryError)}`);
        throw failure_1.Failure.internalServer('Failed to upload image to Cloudinary');
    }
});
