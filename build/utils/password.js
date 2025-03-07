"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = require("bcryptjs");
const hashPassword = async ({ password, saltRounds = 10 }) => {
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