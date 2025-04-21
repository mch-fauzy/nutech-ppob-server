import { MembershipRegisterRequest, MembershipLoginRequest, MembershipGetByEmailRequest, MembershipUpdateProfileByEmailRequest, MembershipUpdateProfileImageByEmailRequest, MembershipUpdateProfileImageCloudinaryByEmailRequest } from './membership-request-dto';
/**
 * Validator for membership-related requests
 */
declare class MembershipValidator {
    /**
     * Validator schema for registration requests
     */
    private static registerRequestValidator;
    /**
     * Validates a membership registration request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateRegisterRequest: (req: MembershipRegisterRequest) => Promise<MembershipRegisterRequest>;
    /**
     * Validator schema for login requests
     */
    private static loginRequestValidator;
    /**
     * Validates a membership login request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateLoginRequest: (req: MembershipLoginRequest) => Promise<MembershipLoginRequest>;
    /**
     * Validator schema for get-by-email requests
     */
    private static getByEmailRequestValidator;
    /**
     * Validates a get-by-email request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateGetByEmailRequest: (req: MembershipGetByEmailRequest) => Promise<MembershipGetByEmailRequest>;
    /**
     * Validator schema for profile update requests
     */
    private static updateProfileByEmailRequestValidator;
    /**
     * Validates a profile update request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateUpdateProfileByEmailRequest: (req: MembershipUpdateProfileByEmailRequest) => Promise<MembershipUpdateProfileByEmailRequest>;
    /**
     * Validator schema for profile image update requests
     */
    private static updateProfileImageByEmailRequestValidator;
    /**
     * Validates a profile image update request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateUpdateProfileImageByEmailRequest: (req: MembershipUpdateProfileImageByEmailRequest) => Promise<MembershipUpdateProfileImageByEmailRequest>;
    /**
     * Validator schema for profile image update via Cloudinary requests
     */
    private static updateProfileImageByEmailCloudinaryRequestValidator;
    /**
     * Validates a profile image update via Cloudinary request
     * @param req The request to validate
     * @returns The validated request
     */
    static validateUpdateProfileImageCloudinaryByEmailRequest: (req: MembershipUpdateProfileImageCloudinaryByEmailRequest) => Promise<MembershipUpdateProfileImageCloudinaryByEmailRequest>;
}
export { MembershipValidator };
