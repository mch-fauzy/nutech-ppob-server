"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../configs/config");
const express_constant_1 = require("../common/constants/express-constant");
const failure_1 = require("../common/utils/errors/failure");
class AuthMiddleware {
    static authenticateToken = (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1]; // Check if authHeader is exist (using optional chaining ?.) and get the token only (Bearer <Token>)
        if (!token) {
            throw failure_1.Failure.unauthorized('Missing token');
        }
        (0, jsonwebtoken_1.verify)(token, config_1.CONFIG.APP.JWT_ACCESS_SECRET, (error, decodedToken) => {
            if (error || !decodedToken) {
                throw failure_1.Failure.unauthorized('Token is invalid or expired');
            }
            const decodedTokenPayload = decodedToken;
            if (!decodedTokenPayload.email) {
                throw failure_1.Failure.unauthorized('Incomplete token payload');
            }
            // Set decoded token details to response locals
            res.locals[express_constant_1.EXPRESS.LOCAL.EMAIL] = decodedTokenPayload.email;
            res.locals[express_constant_1.EXPRESS.LOCAL.IAT] = decodedTokenPayload.iat;
            res.locals[express_constant_1.EXPRESS.LOCAL.EXP] = decodedTokenPayload.exp;
            next();
        });
    };
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth-middleware.js.map