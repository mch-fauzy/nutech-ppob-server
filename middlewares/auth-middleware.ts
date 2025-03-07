import {Request, Response, NextFunction} from 'express';
import {verify} from 'jsonwebtoken';

import {MembershipTokenPayload} from '../models/dto/membership-dto';
import {CONFIG} from '../configs/config';
import {CONSTANT} from '../utils/constant';
import {Failure} from '../utils/failure';

class AuthMiddleware {
  static authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Check if authHeader is exist (using optional chaining ?.) and get the token only (Bearer <Token>)
    if (!token) {
      throw Failure.unauthorized('Missing token');
    }

    verify(token, CONFIG.APP.JWT_ACCESS_SECRET!, (error, decodedToken) => {
      if (error || !decodedToken) {
        throw Failure.unauthorized('Token is invalid or expired');
      }

      const decodedTokenPayload = decodedToken as MembershipTokenPayload;

      if (!decodedTokenPayload.email) {
        throw Failure.unauthorized('Incomplete token payload');
      }

      // Set decoded token details to response locals
      res.locals[CONSTANT.LOCAL.EMAIL] = decodedTokenPayload.email;
      res.locals[CONSTANT.LOCAL.IAT] = decodedTokenPayload.iat;
      res.locals[CONSTANT.LOCAL.EXP] = decodedTokenPayload.exp;
      next();
    });
  };
}

export {AuthMiddleware};
