import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { CONFIG } from '../configs/config';
import { Failure } from '../utils/failure';
import { CONSTANT } from '../utils/constant';

const imageValidation = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!CONSTANT.MULTER.ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
        return cb(Failure.badRequest('Unsupported file format. Only JPEG and PNG are allowed'));
    }

    cb(null, true);
}

/**
 * Multer configuration for local storage
 */
const saveImageToLocal = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, CONFIG.APP.IMAGE_STORAGE_DIRECTORY!); // Directory where files are stored
        },
        filename: (req, file, cb) => {
            // Generate a unique filename with the original extension
            const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
            cb(null, uniqueFilename);
        },
    }),
    fileFilter: imageValidation,
    limits: {
        fileSize: CONSTANT.MULTER.IMAGE_SIZE_LIMIT
    },
}).single(CONSTANT.MULTER.IMAGE_FIELD_NAME);


/**
 * Multer configuration for buffer storage 
 */
const uploadImageToCloud = multer({
    fileFilter: imageValidation,
    storage: multer.memoryStorage(),
    limits: {
        fileSize: CONSTANT.MULTER.IMAGE_SIZE_LIMIT
    },
}).single(CONSTANT.MULTER.IMAGE_FIELD_NAME);

export {
    saveImageToLocal,
    uploadImageToCloud
};
