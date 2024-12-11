"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const failure_1 = require("../utils/failure");
const response_1 = require("../utils/response");
const winston_1 = require("../configs/winston");
const constant_1 = require("../utils/constant");
// NextFunction must be included to make error handler middleware to work properly
const errorHandler = (error, req, res, next) => {
    // Handle custom errors
    if (error instanceof failure_1.Failure && error.name === 'Failure') {
        (0, response_1.responseWithDetails)(res, error.code, error.status, error.message, null);
        return;
    }
    // Handle validation errors for Joi validator
    if (error instanceof Error && error.name === 'ValidationError') {
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, constant_1.CONSTANT.INTERNAL_STATUS_CODES.BAD_REQUEST, error.message, null);
        return;
    }
    // Handle unexpected errors
    winston_1.logger.error(`[errorHandler] Unexpected error: ${JSON.stringify(error)}`);
    (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, constant_1.CONSTANT.INTERNAL_STATUS_CODES.SERVER_ERROR, 'Something went wrong', null);
    next();
};
exports.errorHandler = errorHandler;
