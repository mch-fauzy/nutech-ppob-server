import type { MembershipLoginResponse } from '../../../models/dto/membership/membership-response-dto';
import type { MembershipTokenPayload } from '../../../models/dto/membership/membership-request-dto';
/**
 * Generates a JSON Web Token (JWT) for user authentication
 */
declare const generateToken: ({ email, }: Pick<MembershipTokenPayload, 'email'>) => MembershipLoginResponse;
export { generateToken };
