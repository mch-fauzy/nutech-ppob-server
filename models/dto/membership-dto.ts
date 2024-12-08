import Joi from "joi";
import { JwtPayload } from "jsonwebtoken";

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
}

export {
    MembershipRegisterRequest,
    MembershipLoginRequest,
    MembershipTokenPayload,
    MembershipLoginResponse,
    MembershipValidator
};
