import {sign} from 'jsonwebtoken';

import {
  MembershipLoginResponse,
  MembershipTokenPayload,
} from '../models/dto/membership-dto';
import {CONFIG} from '../configs/config';
import {CONSTANT} from './constant';

/**
 * Generates a JSON Web Token (JWT) for user authentication
 */
const generateToken = ({
  email,
}: Pick<MembershipTokenPayload, 'email'>): MembershipLoginResponse => {
  const token = sign({email}, CONFIG.APP.JWT_ACCESS_SECRET!, {
    expiresIn: CONSTANT.JWT.EXPIRATION_TIME,
  });

  return {
    token,
  };
};

export {generateToken};
