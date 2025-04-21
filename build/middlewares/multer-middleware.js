"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../configs/config");
const failure_1 = require("../common/utils/errors/failure");
const multer_constant_1 = require("../common/constants/multer-constant");
const regex_constant_1 = require("../common/constants/regex-constant");
const express_constant_1 = require("../common/constants/express-constant");
class MulterMiddleware {
    static validateProfileImage = (req, file, cb) => {
        // Rename profle image name based on user email
        const email = req.res?.locals[express_constant_1.EXPRESS.LOCAL.EMAIL];
        file.filename = email?.replace(regex_constant_1.REGEX.NOT_ALPHANUMERIC, '-');
        if (!multer_constant_1.MULTER.ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
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
            fileSize: multer_constant_1.MULTER.IMAGE_SIZE_LIMIT,
        },
        storage: multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, config_1.CONFIG.APP.IMAGE_STORAGE_DIRECTORY); // Directory where files are stored
            },
            filename: (req, file, cb) => {
                cb(null, `${file.filename}${path_1.default.extname(file.originalname)}`); // Local image name with extension
            },
        }),
    }).single(multer_constant_1.MULTER.IMAGE_FIELD_NAME);
    /**
     * Profile Image Multer configuration for buffer storage
     */
    static uploadProfileImageToCloud = (0, multer_1.default)({
        fileFilter: this.validateProfileImage,
        limits: {
            fileSize: multer_constant_1.MULTER.IMAGE_SIZE_LIMIT,
        },
        storage: multer_1.default.memoryStorage(),
    }).single(multer_constant_1.MULTER.IMAGE_FIELD_NAME);
}
exports.MulterMiddleware = MulterMiddleware;
//# sourceMappingURL=multer-middleware.js.map