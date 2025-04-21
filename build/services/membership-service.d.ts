import type { MembershipRegisterRequest, MembershipLoginRequest, MembershipGetByEmailRequest, MembershipUpdateProfileByEmailRequest, MembershipUpdateProfileImageByEmailRequest, MembershipUpdateProfileImageCloudinaryByEmailRequest } from '../models/dto/membership/membership-request-dto';
declare class MembershipService {
    static register: (req: MembershipRegisterRequest) => Promise<null>;
    static login: (req: MembershipLoginRequest) => Promise<import("../models/dto/membership/membership-response-dto").MembershipLoginResponse>;
    static getByEmail: (req: MembershipGetByEmailRequest) => Promise<import("../models/user-model").User>;
    static updateProfileByEmail: (req: MembershipUpdateProfileByEmailRequest) => Promise<null>;
    static updateProfileImageByEmail: (req: MembershipUpdateProfileImageByEmailRequest) => Promise<null>;
    static updateProfileImageCloudinaryByEmail: (req: MembershipUpdateProfileImageCloudinaryByEmailRequest) => Promise<null>;
}
export { MembershipService };
