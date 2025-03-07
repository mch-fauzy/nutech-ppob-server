"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const CONFIG = {
    SERVER: {
        PORT: process.env.SERVER_PORT,
    },
    APP: {
        NAME: process.env.APP_NAME,
        BASE_URL: process.env.APP_BASE_URL,
        DOCS: process.env.APP_DOCS,
        JWT_ACCESS_SECRET: process.env.APP_JWT_ACCESS_SECRET,
        STATIC_DIRECTORY: process.env.APP_STATIC_DIRECTORY,
        IMAGE_STATIC_URL: process.env.APP_IMAGE_STATIC_URL,
        IMAGE_STORAGE_DIRECTORY: process.env.APP_IMAGE_STORAGE_DIRECTORY,
    },
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET,
        IMAGE_STORAGE_DIRECTORY: process.env.CLOUDINARY_IMAGE_STORAGE_DIRECTORY,
    },
};
exports.CONFIG = CONFIG;
//# sourceMappingURL=config.js.map