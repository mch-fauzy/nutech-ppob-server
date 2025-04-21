import {sign} from 'jsonwebtoken';

import type {MembershipLoginResponse} from '../../../models/dto/membership/membership-response-dto';
import type {MembershipTokenPayload} from '../../../models/dto/membership/membership-request-dto';
import {CONFIG} from '../../../configs/config';
import {JWT} from '../../constants/jwt-constant';

/**
 * Generates a JSON Web Token (JWT) for user authentication
 */
const generateToken = ({
  email,
}: Pick<MembershipTokenPayload, 'email'>): MembershipLoginResponse => {
  const token = sign({email}, CONFIG.APP.JWT_ACCESS_SECRET!, {
    expiresIn: JWT.EXPIRATION_TIME,
  });

  return {
    token,
  };
};

export {generateToken};
