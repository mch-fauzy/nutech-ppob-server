import multer, {FileFilterCallback} from 'multer';
import {Request} from 'express';
import path from 'path';

import {CONFIG} from '../configs/config';
import {Failure} from '../common/utils/errors/failure';
import {MULTER} from '../common/constants/multer-constant';
import {REGEX} from '../common/constants/regex-constant';
import {EXPRESS} from '../common/constants/express-constant';

class MulterMiddleware {
  private static validateProfileImage = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    // Rename profle image name based on user email
    const email = req.res?.locals[EXPRESS.LOCAL.EMAIL];
    file.filename = email?.replace(REGEX.NOT_ALPHANUMERIC, '-');

    if (!MULTER.ALLOWED_IMAGE_FORMATS.includes(file.mimetype)) {
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
      fileSize: MULTER.IMAGE_SIZE_LIMIT,
    },
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, CONFIG.APP.IMAGE_STORAGE_DIRECTORY!); // Directory where files are stored
      },
      filename: (req, file, cb) => {
        cb(null, `${file.filename}${path.extname(file.originalname)}`); // Local image name with extension
      },
    }),
  }).single(MULTER.IMAGE_FIELD_NAME);

  /**
   * Profile Image Multer configuration for buffer storage
   */
  static uploadProfileImageToCloud = multer({
    fileFilter: this.validateProfileImage,
    limits: {
      fileSize: MULTER.IMAGE_SIZE_LIMIT,
    },
    storage: multer.memoryStorage(),
  }).single(MULTER.IMAGE_FIELD_NAME);
}

export {MulterMiddleware};
