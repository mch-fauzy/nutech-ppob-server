"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../configs/config");
const constant_1 = require("./constant");
const generateToken = (req) => {
    const token = (0, jsonwebtoken_1.sign)({
        email: req.email
    }, config_1.CONFIG.APP.JWT_ACCESS_KEY, { expiresIn: constant_1.CONSTANT.JWT.EXPIRY });
    return {
        token: token
    };
};
exports.generateToken = generateToken;
