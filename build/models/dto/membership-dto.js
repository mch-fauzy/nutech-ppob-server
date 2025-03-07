"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class MembershipValidator {
    static registerRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        password: joi_1.default.string().min(8).required(),
    });
    static validateRegisterRequest = async (req) => {
        return await this.registerRequestValidator.validateAsync(req);
    };
    static loginRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(8).required(),
    });
    static validateLoginRequest = async (req) => {
        return await this.loginRequestValidator.validateAsync(req);
    };
    static getByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
    });
    static validateGetByEmailRequest = async (req) => {
        return await this.getByEmailRequestValidator.validateAsync(req);
    };
    static updateProfileByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
    });
    static validateUpdateProfileByEmailRequest = async (req) => {
        return await this.updateProfileByEmailRequestValidator.validateAsync(req);
    };
    static updateProfileImageByEmailRequestValidator = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        imageUrl: joi_1.default.string().uri().required(),
    });
    static validateUpdateProfileImageByEmailRequest = async (req) => {
        return await this.updateProfileImageByEmailRequestValidator.validateAsync(req);
    };
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
    static validateUpdateProfileImageCloudinaryByEmailRequest = async (req) => {
        return await this.updateProfileImageByEmailCloudinaryRequestValidator.validateAsync(req);
    };
}
exports.MembershipValidator = MembershipValidator;
//# sourceMappingURL=membership-dto.js.map