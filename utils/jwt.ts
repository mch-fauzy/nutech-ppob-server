import { sign } from 'jsonwebtoken';

import {
    MembershipLoginResponse,
    MembershipTokenPayload
} from '../models/dto/membership-dto';
import { CONFIG } from '../configs/config';
import { CONSTANT } from './constant';

const generateToken = (req: Pick<MembershipTokenPayload, 'email'>): MembershipLoginResponse => {
    const token = sign(
        {
            email: req.email
        },
        CONFIG.APP.JWT_ACCESS_SECRET!,
        { expiresIn: CONSTANT.JWT.EXPIRATION_TIME });

    return {
        token: token
    };
};

export { generateToken };
