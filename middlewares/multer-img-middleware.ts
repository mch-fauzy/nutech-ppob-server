import multer, { StorageEngine, FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { CONFIG } from '../configs/config';
import { Failure } from '../utils/failure';
import { CONSTANT } from '../utils/constant';

const imageValidation = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!CONSTANT.ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
        return cb(Failure.badRequest('Unsupported file format. Only JPEG and PNG are allowed'));
    }

    cb(null, true);
}

// Storage Configuration
const localStorage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, CONFIG.APP.IMAGE_STORAGE_PATH!); // Directory where files are stored
    },
    filename: (req, file, cb) => {
        // Generate a unique filename with the original extension
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    },
});

// Multer Configuration
const uploadImageToLocal = multer({
    storage: localStorage,
    fileFilter: imageValidation,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB file size limit mb = bytes * bytes
    },
}).single('image'); // Field named 'image' is expected in the request

export { uploadImageToLocal };
