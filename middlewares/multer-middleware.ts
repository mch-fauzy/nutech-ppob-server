import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

import { CONFIG } from '../configs/config';
import { Failure } from '../utils/failure';
import { CONSTANT } from '../utils/constant';
import path from 'path';

const validateProfileImage = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!file) return cb(Failure.badRequest('No file uploaded'));

    // Rename profle image based on user email
    const email = String(req.headers[CONSTANT.HEADERS.EMAIL]);
    file.filename = email.replace(CONSTANT.REGEX.NOT_ALPHANUMERIC, '-');

    if (!CONSTANT.MULTER.ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
        return cb(Failure.badRequest('Unsupported file format. Only JPEG and PNG are allowed'));
    }

    cb(null, true);
}

/**
* Profile Image Multer configuration for local storage
*/
const saveProfileImageToLocal = multer({
    fileFilter: validateProfileImage,
    limits: {
        fileSize: CONSTANT.MULTER.IMAGE_SIZE_LIMIT
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, CONFIG.APP.IMAGE_STORAGE_DIRECTORY!); // Directory where files are stored
        },
        filename: (req, file, cb) => {
            cb(null, `${file.filename}${path.extname(file.originalname)}`); // Local image name with extension
        },
    })
}).single(CONSTANT.MULTER.IMAGE_FIELD_NAME);

/**
* Profile Image Multer configuration for buffer storage 
*/
const uploadProfileImageToCloud = multer({
    fileFilter: validateProfileImage,
    limits: {
        fileSize: CONSTANT.MULTER.IMAGE_SIZE_LIMIT
    },
    storage: multer.memoryStorage(),
}).single(CONSTANT.MULTER.IMAGE_FIELD_NAME);

export {
    saveProfileImageToLocal,
    uploadProfileImageToCloud
};
