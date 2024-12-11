"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileImageToCloud = exports.saveProfileImageToLocal = void 0;
const multer_1 = __importDefault(require("multer"));
const config_1 = require("../configs/config");
const failure_1 = require("../utils/failure");
const constant_1 = require("../utils/constant");
const path_1 = __importDefault(require("path"));
const validateProfileImage = (req, file, cb) => {
    if (!file)
        return cb(failure_1.Failure.badRequest('No file uploaded'));
    // Rename profle image based on user email
    const email = String(req.headers[constant_1.CONSTANT.HEADERS.EMAIL]);
    file.filename = email.replace(constant_1.CONSTANT.REGEX.NOT_ALPHANUMERIC, '-');
    if (!constant_1.CONSTANT.MULTER.ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
        return cb(failure_1.Failure.badRequest('Unsupported file format. Only JPEG and PNG are allowed'));
    }
    cb(null, true);
};
/**
* Profile Image Multer configuration for local storage
*/
const saveProfileImageToLocal = (0, multer_1.default)({
    fileFilter: validateProfileImage,
    limits: {
        fileSize: constant_1.CONSTANT.MULTER.IMAGE_SIZE_LIMIT
    },
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, config_1.CONFIG.APP.IMAGE_STORAGE_DIRECTORY); // Directory where files are stored
        },
        filename: (req, file, cb) => {
            cb(null, `${file.filename}${path_1.default.extname(file.originalname)}`); // Local image name with extension
        },
    })
}).single(constant_1.CONSTANT.MULTER.IMAGE_FIELD_NAME);
exports.saveProfileImageToLocal = saveProfileImageToLocal;
/**
* Profile Image Multer configuration for buffer storage
*/
const uploadProfileImageToCloud = (0, multer_1.default)({
    fileFilter: validateProfileImage,
    limits: {
        fileSize: constant_1.CONSTANT.MULTER.IMAGE_SIZE_LIMIT
    },
    storage: multer_1.default.memoryStorage(),
}).single(constant_1.CONSTANT.MULTER.IMAGE_FIELD_NAME);
exports.uploadProfileImageToCloud = uploadProfileImageToCloud;
