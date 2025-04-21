import {Request, Response, NextFunction} from 'express';
import {verify} from 'jsonwebtoken';

import {MembershipTokenPayload} from '../models/dto/membership/membership-request-dto';
import {CONFIG} from '../configs/config';
import {EXPRESS} from '../common/constants/express-constant';
import {Failure} from '../common/utils/errors/failure';

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
      res.locals[EXPRESS.LOCAL.EMAIL] = decodedTokenPayload.email;
      res.locals[EXPRESS.LOCAL.IAT] = decodedTokenPayload.iat;
      res.locals[EXPRESS.LOCAL.EXP] = decodedTokenPayload.exp;
      next();
    });
  };
}

export {AuthMiddleware};
