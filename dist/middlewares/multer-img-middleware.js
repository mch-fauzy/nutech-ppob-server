"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToLocal = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const config_1 = require("../configs/config");
const failure_1 = require("../utils/failure");
const constant_1 = require("../utils/constant");
const imageValidation = (req, file, cb) => {
    if (!constant_1.CONSTANT.ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
        return cb(failure_1.Failure.badRequest('Unsupported file format. Only JPEG and PNG are allowed'));
    }
    cb(null, true);
};
// Storage Configuration
const localStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config_1.CONFIG.APP.IMAGE_STORAGE_PATH); // Directory where files are stored
    },
    filename: (req, file, cb) => {
        // Generate a unique filename with the original extension
        const uniqueFilename = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    },
});
// Multer Configuration
const uploadImageToLocal = (0, multer_1.default)({
    storage: localStorage,
    fileFilter: imageValidation,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB file size limit mb = bytes * bytes
    },
}).single('image'); // Field named 'image' is expected in the request
exports.uploadImageToLocal = uploadImageToLocal;
