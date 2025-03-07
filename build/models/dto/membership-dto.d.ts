import { JwtPayload } from 'jsonwebtoken';
import { CloudinaryUploadImageRequest } from './externals/cloudinary-dto';
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
interface MembershipUpdateProfileByEmailRequest {
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
interface MembershipTokenPayload extends JwtPayload {
    email: string;
}
interface MembershipLoginResponse {
    token: string;
}
declare class MembershipValidator {
    private static registerRequestValidator;
    static validateRegisterRequest: (req: MembershipRegisterRequest) => Promise<MembershipRegisterRequest>;
    private static loginRequestValidator;
    static validateLoginRequest: (req: MembershipLoginRequest) => Promise<MembershipLoginRequest>;
    private static getByEmailRequestValidator;
    static validateGetByEmailRequest: (req: MembershipGetByEmailRequest) => Promise<MembershipGetByEmailRequest>;
    private static updateProfileByEmailRequestValidator;
    static validateUpdateProfileByEmailRequest: (req: MembershipUpdateProfileByEmailRequest) => Promise<MembershipUpdateProfileByEmailRequest>;
    private static updateProfileImageByEmailRequestValidator;
    static validateUpdateProfileImageByEmailRequest: (req: MembershipUpdateProfileImageByEmailRequest) => Promise<MembershipUpdateProfileImageByEmailRequest>;
    private static updateProfileImageByEmailCloudinaryRequestValidator;
    static validateUpdateProfileImageCloudinaryByEmailRequest: (req: MembershipUpdateProfileImageCloudinaryByEmailRequest) => Promise<MembershipUpdateProfileImageCloudinaryByEmailRequest>;
}
export type { MembershipRegisterRequest, MembershipLoginRequest, MembershipGetByEmailRequest, MembershipUpdateProfileByEmailRequest, MembershipUpdateProfileImageByEmailRequest, MembershipUpdateProfileImageCloudinaryByEmailRequest, MembershipTokenPayload, MembershipLoginResponse, };
export { MembershipValidator };
