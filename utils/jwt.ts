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
        CONFIG.APP.JWT_ACCESS_KEY!,
        { expiresIn: CONSTANT.JWT.EXPIRY });

    return {
        token: token
    };
};

export { generateToken };
