import Joi from "joi";
import { JwtPayload } from "jsonwebtoken";

import { CloudinaryUploadImageRequest } from "./externals/cloudinary-dto";

interface MembershipRegisterRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

interface MembershipLoginRequest {
    email: string;
    password: string;
}

interface MembershipGetByEmailRequest {
    email: string;
}

interface MembershipUpdateByEmailRequest {
    email: string;
    firstName: string;
    lastName: string;
}

interface MembershipUpdateProfileImageByEmailRequest {
    email: string;
    imageUrl: string;
}

interface MembershipUpdateProfileImageCloudinaryByEmailRequest extends CloudinaryUploadImageRequest {
    email: string;
}

interface MembershipLoginResponse {
    token: string;
}

interface MembershipTokenPayload extends JwtPayload {
    email: string;
}

class MembershipValidator {
    private static registerRequestValidator = Joi.object({
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().min(8).required(),
    });

    static validateRegisterRequest = async (req: MembershipRegisterRequest): Promise<MembershipRegisterRequest> => {
        return await this.registerRequestValidator.validateAsync(req);
    };

    private static loginRequestValidator = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });

    static validateLoginRequest = async (req: MembershipLoginRequest): Promise<MembershipLoginRequest> => {
        return await this.loginRequestValidator.validateAsync(req);
    };

    private static getByEmailRequestValidator = Joi.object({
        email: Joi.string().email().required(),
    });

    static validateGetByEmailRequest = async (req: MembershipGetByEmailRequest): Promise<MembershipGetByEmailRequest> => {
        return await this.getByEmailRequestValidator.validateAsync(req);
    };

    private static updateByEmailRequestValidator = Joi.object({
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    });

    static validateUpdateByEmailRequest = async (req: MembershipUpdateByEmailRequest): Promise<MembershipUpdateByEmailRequest> => {
        return await this.updateByEmailRequestValidator.validateAsync(req);
    };

    private static updateProfileImageByEmailRequestValidator = Joi.object({
        email: Joi.string().email().required(),
        imageUrl: Joi.string().uri().required()
    });

    static validateUpdateProfileImageByEmailRequest = async (req: MembershipUpdateProfileImageByEmailRequest): Promise<MembershipUpdateProfileImageByEmailRequest> => {
        return await this.updateProfileImageByEmailRequestValidator.validateAsync(req);
    };

    private static updateProfileImageByEmailCloudinaryRequestValidator = Joi.object({
        email: Joi.string().email().required(),
        fileName: Joi.string().required(),
        buffer: Joi.any().custom((value, helpers) => {
            if (!(value instanceof Buffer)) return helpers.error('any.invalid');
            return value;
        }).required(),
        mimeType: Joi.string().required()
    });

    static validateUpdateProfileImageCloudinaryByEmailRequest = async (req: MembershipUpdateProfileImageCloudinaryByEmailRequest): Promise<MembershipUpdateProfileImageCloudinaryByEmailRequest> => {
        return await this.updateProfileImageByEmailCloudinaryRequestValidator.validateAsync(req);
    };
}

export {
    MembershipRegisterRequest,
    MembershipLoginRequest,
    MembershipGetByEmailRequest,
    MembershipUpdateByEmailRequest,
    MembershipUpdateProfileImageByEmailRequest,
    MembershipUpdateProfileImageCloudinaryByEmailRequest,
    MembershipTokenPayload,
    MembershipLoginResponse,
    MembershipValidator
};
