import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import { MembershipTokenPayload } from '../models/dto/membership-dto';
import { CONFIG } from '../configs/config';
import { CONSTANT } from '../utils/constant';
import { responseWithDetails } from '../utils/response';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Check if authHeader is exist (using optional chaining ?.) and get the token only (Bearer <Token>)
    if (!token) {
        responseWithDetails(res, StatusCodes.UNAUTHORIZED, CONSTANT.STATUS.UNAUTHORIZED, 'Missing token', null);
        return;
    }

    verify(token, CONFIG.APP.JWT_ACCESS_KEY!, (error, decodedToken) => {
        if (error || !decodedToken) {
            responseWithDetails(res, StatusCodes.UNAUTHORIZED, CONSTANT.STATUS.UNAUTHORIZED, 'Token is invalid or expired', null);
            return;
        }

        const decodedTokenPayload = decodedToken as MembershipTokenPayload;

        if (!decodedTokenPayload.email) {
            responseWithDetails(res, StatusCodes.UNAUTHORIZED, CONSTANT.STATUS.UNAUTHORIZED, 'Incomplete token payload', null);
            return;
        }

        // Set decoded token details to custom headers
        req.headers[CONSTANT.HEADERS.EMAIL] = decodedTokenPayload.email;
        req.headers[CONSTANT.HEADERS.IAT] = String(decodedTokenPayload.iat);
        req.headers[CONSTANT.HEADERS.EXP] = String(decodedTokenPayload.exp);

        next();
    });
};

export { authenticateToken };
