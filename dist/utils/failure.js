"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Failure = void 0;
const http_status_codes_1 = require("http-status-codes");
const constant_1 = require("./constant");
class Failure extends Error {
    constructor(message, code, status) {
        super(message); // Call the constructor of its parent class to access the parent's properties and methods
        this.code = code;
        this.status = status;
        this.name = 'Failure';
        // Showing only the relevant function calls leading to the error
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Failure);
        }
    }
}
exports.Failure = Failure;
Failure.notFound = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.NOT_FOUND, constant_1.CONSTANT.INTERNAL_STATUS_CODES.NOT_FOUND);
};
Failure.unauthorized = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.UNAUTHORIZED, constant_1.CONSTANT.INTERNAL_STATUS_CODES.UNAUTHORIZED);
};
Failure.invalidCredentials = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.UNAUTHORIZED, constant_1.CONSTANT.INTERNAL_STATUS_CODES.INVALID_CREDENTIALS);
};
Failure.internalServer = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, constant_1.CONSTANT.INTERNAL_STATUS_CODES.SERVER_ERROR);
};
Failure.badRequest = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.BAD_REQUEST, constant_1.CONSTANT.INTERNAL_STATUS_CODES.BAD_REQUEST);
};
Failure.conflict = (message) => {
    return new Failure(message, http_status_codes_1.StatusCodes.CONFLICT, constant_1.CONSTANT.INTERNAL_STATUS_CODES.CONFLICT);
};
