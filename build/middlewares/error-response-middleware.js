"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponseMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const failure_1 = require("../common/utils/errors/failure");
const response_1 = require("../common/utils/http/response");
const internal_status_code_constant_1 = require("../common/constants/internal-status-code-constant");
const error_message_constant_1 = require("../common/constants/error-message-constant");
const logger_1 = require("../common/utils/logging/logger");
class ErrorResponseMiddleware {
    // NextFunction must be included to make error response handler middleware to work properly
    static handler = (error, req, res, next) => {
        // Response with known errors
        if (error instanceof failure_1.Failure && error.name === 'Failure') {
            (0, response_1.responseWithDetails)(res, error.code, error.status, error.message, null);
            return;
        }
        // Response with validation errors for Joi validator
        if (error instanceof Error && error.name === 'ValidationError') {
            (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, internal_status_code_constant_1.INTERNAL_STATUS_CODE.BAD_REQUEST, error.message, null);
            return;
        }
        // Response with unknown errors
        (0, logger_1.logUnknownError)({
            message: error_message_constant_1.ERROR_MESSAGE.UNKNOWN,
            operationName: 'errorApiResponseHandler',
            error: error,
        });
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, internal_status_code_constant_1.INTERNAL_STATUS_CODE.SERVER_ERROR, error_message_constant_1.ERROR_MESSAGE.UNKNOWN, null);
        next();
    };
}
exports.ErrorResponseMiddleware = ErrorResponseMiddleware;
//# sourceMappingURL=error-response-middleware.js.map