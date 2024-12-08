"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseWithDetails = void 0;
const responseWithDetails = (res, code, status, message, data) => {
    res.status(code).json({ status: status, message: message, data: data });
};
exports.responseWithDetails = responseWithDetails;
