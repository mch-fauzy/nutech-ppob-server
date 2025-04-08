"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = require("bcryptjs");
const config_1 = require("../configs/config");
const hashPassword = async ({ password, saltRounds = Number(config_1.CONFIG.BCRYPT_SALT_ROUNDS), }) => {
    const salt = await (0, bcryptjs_1.genSalt)(saltRounds);
    const hashedPassword = await (0, bcryptjs_1.hash)(password, salt);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
const comparePassword = async ({ password, hashedPassword }) => {
    const isValidPassword = await (0, bcryptjs_1.compare)(password, hashedPassword);
    return isValidPassword;
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=password.js.map