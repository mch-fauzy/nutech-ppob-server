"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Failure = void 0;
const http_status_codes_1 = require("http-status-codes");
const constant_1 = require("./constant");
class Failure extends Error {
    /* Custom properties */
    code;
    status;
    constructor(message, code, status) {
        super(message); /* Call the constructor of its parent class to access the parent's properties and methods */
        this.code = code;
        this.status = status;
        this.name = 'Failure';
        /* Showing only the relevant function calls leading to the error */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Failure);
        }
    }
    static notFound = (message) => {
        return new Failure(message, http_status_codes_1.StatusCodes.NOT_FOUND, constant_1.CONSTANT.INTERNAL_STATUS_CODE.NOT_FOUND);
    };
    static unauthorized = (message) => {
        return new Failure(message, http_status_codes_1.StatusCodes.UNAUTHORIZED, constant_1.CONSTANT.INTERNAL_STATUS_CODE.UNAUTHORIZED);
    };
    static invalidCredentials = (message) => {
        return new Failure(message, http_status_codes_1.StatusCodes.UNAUTHORIZED, constant_1.CONSTANT.INTERNAL_STATUS_CODE.INVALID_CREDENTIALS);
    };
    static internalServer = (message) => {
        return new Failure(message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, constant_1.CONSTANT.INTERNAL_STATUS_CODE.SERVER_ERROR);
    };
    static badRequest = (message) => {
        return new Failure(message, http_status_codes_1.StatusCodes.BAD_REQUEST, constant_1.CONSTANT.INTERNAL_STATUS_CODE.BAD_REQUEST);
    };
    static conflict = (message) => {
        return new Failure(message, http_status_codes_1.StatusCodes.CONFLICT, constant_1.CONSTANT.INTERNAL_STATUS_CODE.CONFLICT);
    };
}
exports.Failure = Failure;
//# sourceMappingURL=failure.js.map