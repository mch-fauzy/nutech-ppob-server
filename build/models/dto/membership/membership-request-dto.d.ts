import { JwtPayload } from 'jsonwebtoken';
import { CloudinaryUploadImageRequest } from '../externals/cloudinary-request-dto';
/**
 * Base interface for membership requests with email
 */
interface MembershipBaseRequest {
    email: string;
}
/**
 * Request interface for membership registration
 */
interface MembershipRegisterRequest extends MembershipBaseRequest {
    firstName: string;
    lastName: string;
    password: string;
}
/**
 * Request interface for membership login
 */
interface MembershipLoginRequest extends MembershipBaseRequest {
    password: string;
}
/**
 * Request interface for getting membership by email
 */
type MembershipGetByEmailRequest = MembershipBaseRequest;
/**
 * Request interface for updating membership profile
 */
interface MembershipUpdateProfileByEmailRequest extends MembershipBaseRequest {
    firstName: string;
    lastName: string;
}
/**
 * Request interface for updating membership profile image
 */
interface MembershipUpdateProfileImageByEmailRequest extends MembershipBaseRequest {
    imageUrl: string;
}
/**
 * Request interface for updating membership profile image via Cloudinary
 */
interface MembershipUpdateProfileImageCloudinaryByEmailRequest extends CloudinaryUploadImageRequest {
    email: string;
}
/**
 * JWT payload interface for membership tokens
 */
interface MembershipTokenPayload extends JwtPayload {
    email: string;
}
export { MembershipBaseRequest, MembershipRegisterRequest, MembershipLoginRequest, MembershipGetByEmailRequest, MembershipUpdateProfileByEmailRequest, MembershipUpdateProfileImageByEmailRequest, MembershipUpdateProfileImageCloudinaryByEmailRequest, MembershipTokenPayload, };
