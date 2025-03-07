/// <reference types="qs" />
/// <reference types="express" />
declare class MulterMiddleware {
    private static validateProfileImage;
    /**
     * Profile Image Multer configuration for local storage
     */
    static saveProfileImageToLocal: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Profile Image Multer configuration for buffer storage
     */
    static uploadProfileImageToCloud: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
export { MulterMiddleware };
