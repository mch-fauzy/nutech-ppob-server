"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../../../configs/config");
const jwt_constant_1 = require("../../constants/jwt-constant");
/**
 * Generates a JSON Web Token (JWT) for user authentication
 */
const generateToken = ({ email, }) => {
    const token = (0, jsonwebtoken_1.sign)({ email }, config_1.CONFIG.APP.JWT_ACCESS_SECRET, {
        expiresIn: jwt_constant_1.JWT.EXPIRATION_TIME,
    });
    return {
        token,
    };
};
exports.generateToken = generateToken;
//# sourceMappingURL=jwt.js.map