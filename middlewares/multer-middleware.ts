import multer, {FileFilterCallback} from 'multer';
import {Request} from 'express';
import path from 'path';

import {CONFIG} from '../configs/config';
import {Failure} from '../utils/failure';
import {CONSTANT} from '../utils/constant';

class MulterMiddleware {
  private static validateProfileImage = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    // Rename profle image name based on user email
    const email = req.res?.locals[CONSTANT.LOCAL.EMAIL];
    file.filename = email?.replace(CONSTANT.REGEX.NOT_ALPHANUMERIC, '-');

    if (!CONSTANT.MULTER.ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
      return cb(
        Failure.badRequest(
          'Unsupported file format. Only JPEG and PNG are allowed',
        ),
      );
    }

    cb(null, true);
  };

  /**
   * Profile Image Multer configuration for local storage
   */
  static saveProfileImageToLocal = multer({
    fileFilter: this.validateProfileImage,
    limits: {
      fileSize: CONSTANT.MULTER.IMAGE_SIZE_LIMIT,
    },
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, CONFIG.APP.IMAGE_STORAGE_DIRECTORY!); // Directory where files are stored
      },
      filename: (req, file, cb) => {
        cb(null, `${file.filename}${path.extname(file.originalname)}`); // Local image name with extension
      },
    }),
  }).single(CONSTANT.MULTER.IMAGE_FIELD_NAME);

  /**
   * Profile Image Multer configuration for buffer storage
   */
  static uploadProfileImageToCloud = multer({
    fileFilter: this.validateProfileImage,
    limits: {
      fileSize: CONSTANT.MULTER.IMAGE_SIZE_LIMIT,
    },
    storage: multer.memoryStorage(),
  }).single(CONSTANT.MULTER.IMAGE_FIELD_NAME);
}

export {MulterMiddleware};
