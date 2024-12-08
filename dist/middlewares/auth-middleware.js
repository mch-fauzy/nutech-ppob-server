"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const http_status_codes_1 = require("http-status-codes");
const config_1 = require("../configs/config");
const constant_1 = require("../utils/constant");
const response_1 = require("../utils/response");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1]; // Check if authHeader is exist (using optional chaining ?.) and get the token only (Bearer <Token>)
    if (!token) {
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, constant_1.CONSTANT.STATUS.UNAUTHORIZED, 'Missing token', null);
        return;
    }
    (0, jsonwebtoken_1.verify)(token, config_1.CONFIG.APP.JWT_ACCESS_KEY, (error, decodedToken) => {
        if (error || !decodedToken) {
            (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, constant_1.CONSTANT.STATUS.UNAUTHORIZED, 'Token is invalid or expired', null);
            return;
        }
        const decodedTokenPayload = decodedToken;
        if (!decodedTokenPayload.email) {
            (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, constant_1.CONSTANT.STATUS.UNAUTHORIZED, 'Incomplete token payload', null);
            return;
        }
        // Set decoded token details to custom headers
        req.headers[constant_1.CONSTANT.HEADERS.EMAIL] = decodedTokenPayload.email;
        req.headers[constant_1.CONSTANT.HEADERS.IAT] = String(decodedTokenPayload.iat);
        req.headers[constant_1.CONSTANT.HEADERS.EXP] = String(decodedTokenPayload.exp);
        next();
    });
};
exports.authenticateToken = authenticateToken;
