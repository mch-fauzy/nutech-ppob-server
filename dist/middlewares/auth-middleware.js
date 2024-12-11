"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../configs/config");
const constant_1 = require("../utils/constant");
const failure_1 = require("../utils/failure");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1]; // Check if authHeader is exist (using optional chaining ?.) and get the token only (Bearer <Token>)
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
        // Set decoded token details to custom headers
        req.headers[constant_1.CONSTANT.HEADERS.EMAIL] = decodedTokenPayload.email;
        req.headers[constant_1.CONSTANT.HEADERS.IAT] = String(decodedTokenPayload.iat);
        req.headers[constant_1.CONSTANT.HEADERS.EXP] = String(decodedTokenPayload.exp);
        next();
    });
};
exports.authenticateToken = authenticateToken;
