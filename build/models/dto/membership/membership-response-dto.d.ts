/**
 * Response interface for membership login
 */
interface MembershipLoginResponse {
    token: string;
}
/**
 * Response interface for membership profile
 */
interface MembershipProfileResponse {
    email: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
}
export { MembershipLoginResponse, MembershipProfileResponse };
