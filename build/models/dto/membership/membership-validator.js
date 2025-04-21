"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipValidator = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validator for membership-related requests
 */
class MembershipValidator {
    /**
     * Validator schema for registration requests
     */
    static registerRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        password: joi_1.default.string().min(8).required(),
    });
    /**
     * Validates a membership registration request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateRegisterRequest = async (req) => {
        return await this.registerRequestValidator.validateAsync(req);
    };
    /**
     * Validator schema for login requests
     */
    static loginRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(8).required(),
    });
    /**
     * Validates a membership login request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateLoginRequest = async (req) => {
        return await this.loginRequestValidator.validateAsync(req);
    };
    /**
     * Validator schema for get-by-email requests
     */
    static getByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
    });
    /**
     * Validates a get-by-email request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateGetByEmailRequest = async (req) => {
        return await this.getByEmailRequestValidator.validateAsync(req);
    };
    /**
     * Validator schema for profile update requests
     */
    static updateProfileByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
    });
    /**
     * Validates a profile update request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateUpdateProfileByEmailRequest = async (req) => {
        return await this.updateProfileByEmailRequestValidator.validateAsync(req);
    };
    /**
     * Validator schema for profile image update requests
     */
    static updateProfileImageByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        imageUrl: joi_1.default.string().uri().required(),
    });
    /**
     * Validates a profile image update request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateUpdateProfileImageByEmailRequest = async (req) => {
        return await this.updateProfileImageByEmailRequestValidator.validateAsync(req);
    };
    /**
     * Validator schema for profile image update via Cloudinary requests
     */
    static updateProfileImageByEmailCloudinaryRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        fileName: joi_1.default.string().required(),
        buffer: joi_1.default.any()
            .custom((value, helpers) => {
            if (!(value instanceof Buffer))
                return helpers.error('any.invalid');
            return value;
        })
            .required(),
        mimeType: joi_1.default.string().required(),
    });
    /**
     * Validates a profile image update via Cloudinary request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateUpdateProfileImageCloudinaryByEmailRequest = async (req) => {
        return await this.updateProfileImageByEmailCloudinaryRequestValidator.validateAsync(req);
    };
}
exports.MembershipValidator = MembershipValidator;
//# sourceMappingURL=membership-validator.js.map