"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../configs/config");
const failure_1 = require("../utils/failure");
const constant_1 = require("../utils/constant");
class MulterMiddleware {
    static validateProfileImage = (req, file, cb) => {
        // Rename profle image name based on user email
        const email = req.res?.locals[constant_1.CONSTANT.LOCAL.EMAIL];
        file.filename = email?.replace(constant_1.CONSTANT.REGEX.NOT_ALPHANUMERIC, '-');
        if (!constant_1.CONSTANT.MULTER.ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
            return cb(failure_1.Failure.badRequest('Unsupported file format. Only JPEG and PNG are allowed'));
        }
        cb(null, true);
    };
    /**
     * Profile Image Multer configuration for local storage
     */
    static saveProfileImageToLocal = (0, multer_1.default)({
        fileFilter: this.validateProfileImage,
        limits: {
            fileSize: constant_1.CONSTANT.MULTER.IMAGE_SIZE_LIMIT,
        },
        storage: multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, config_1.CONFIG.APP.IMAGE_STORAGE_DIRECTORY); // Directory where files are stored
            },
            filename: (req, file, cb) => {
                cb(null, `${file.filename}${path_1.default.extname(file.originalname)}`); // Local image name with extension
            },
        }),
    }).single(constant_1.CONSTANT.MULTER.IMAGE_FIELD_NAME);
    /**
     * Profile Image Multer configuration for buffer storage
     */
    static uploadProfileImageToCloud = (0, multer_1.default)({
        fileFilter: this.validateProfileImage,
        limits: {
            fileSize: constant_1.CONSTANT.MULTER.IMAGE_SIZE_LIMIT,
        },
        storage: multer_1.default.memoryStorage(),
    }).single(constant_1.CONSTANT.MULTER.IMAGE_FIELD_NAME);
}
exports.MulterMiddleware = MulterMiddleware;
//# sourceMappingURL=multer-middleware.js.map