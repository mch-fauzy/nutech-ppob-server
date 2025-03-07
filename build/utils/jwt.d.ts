import { MembershipLoginResponse, MembershipTokenPayload } from '../models/dto/membership-dto';
/**
 * Generates a JSON Web Token (JWT) for user authentication
 */
declare const generateToken: ({ email, }: Pick<MembershipTokenPayload, 'email'>) => MembershipLoginResponse;
export { generateToken };
