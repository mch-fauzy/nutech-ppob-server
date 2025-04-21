"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const http_status_codes_1 = require("http-status-codes");
const library_1 = require("@prisma/client/runtime/library");
const uuid_1 = require("uuid");
const failure_1 = require("./failure");
const logger_1 = require("../logging/logger");
const error_message_constant_1 = require("../../constants/error-message-constant");
/**
 * Handles an error and returns a corresponding failure response
 */
const handleError = ({ operationName, error }) => {
    if (error instanceof failure_1.Failure) {
        return error;
    }
    if (error instanceof library_1.PrismaClientKnownRequestError ||
        error instanceof library_1.PrismaClientUnknownRequestError ||
        error instanceof library_1.PrismaClientInitializationError ||
        error instanceof library_1.PrismaClientRustPanicError ||
        error instanceof library_1.PrismaClientValidationError) {
        return handlePrismaError({ operationName, error });
    }
    if (isCloudinaryApiError(error)) {
        return handleCloudinaryError({ operationName, error });
    }
    if (error instanceof Error) {
        return handleGenericError({ operationName, error });
    }
    return handleUnknownError({ operationName, error });
};
exports.handleError = handleError;
/**
 * Handles a generic error
 */
const handleGenericError = ({ operationName, error }) => {
    const referenceId = (0, uuid_1.v4)();
    const message = error_message_constant_1.ERROR_MESSAGE.UNRECOGNIZED;
    (0, logger_1.logError)({
        message,
        operationName,
        error,
        referenceId,
    });
    return failure_1.Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
};
/**
 * Handles an unknown error
 */
const handleUnknownError = ({ operationName, error }) => {
    const referenceId = (0, uuid_1.v4)();
    const message = error_message_constant_1.ERROR_MESSAGE.UNKNOWN;
    (0, logger_1.logUnknownError)({
        message,
        operationName,
        error,
        referenceId,
    });
    return failure_1.Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
};
/**
 * Handles Prisma-related errors
 */
const handlePrismaError = ({ operationName, error, }) => {
    const referenceId = (0, uuid_1.v4)();
    if (error instanceof library_1.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2000': {
                const message = 'Input value exceeds the maximum length allowed';
                (0, logger_1.logError)({
                    message,
                    operationName,
                    error,
                    referenceId,
                });
                return failure_1.Failure.badRequest(`${message}. Field: ${error.meta?.column_name}, Reference Id: ${referenceId}`);
            }
            case 'P2001': {
                const message = 'Record matching the specified filter is not found';
                (0, logger_1.logError)({
                    message,
                    operationName,
                    error,
                    referenceId,
                });
                return failure_1.Failure.notFound(`${message}. Field=${error.meta?.argument_name}, Value: ${error.meta?.argument_value}, Reference Id: ${referenceId}`);
            }
            case 'P2002': {
                const message = 'Unique constraint violation occurs';
                (0, logger_1.logError)({
                    message,
                    operationName,
                    error,
                    referenceId,
                });
                return failure_1.Failure.conflict(`${message}. Field: ${error.meta?.constraint}, Reference Id: ${referenceId}`);
            }
            case 'P2003': {
                const message = 'Foreign key constraint violation occurs';
                (0, logger_1.logError)({
                    message,
                    operationName,
                    error,
                    referenceId,
                });
                return failure_1.Failure.badRequest(`${message}. Field: ${error.meta?.field_name}, Reference Id: ${referenceId}`);
            }
            case 'P2010': {
                const message = 'Provided query fails';
                (0, logger_1.logError)({
                    message,
                    operationName,
                    error,
                    referenceId,
                });
                return failure_1.Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
            }
            case 'P2011': {
                const message = 'Null constraint violation occurs';
                (0, logger_1.logError)({
                    message,
                    operationName,
                    error,
                    referenceId,
                });
                return failure_1.Failure.badRequest(`${message}. Field: ${error.meta?.constraint}, Reference Id: ${referenceId}`);
            }
            case 'P2016': {
                const message = 'Error occurs while interpreting the query';
                (0, logger_1.logError)({
                    message,
                    operationName,
                    error,
                    referenceId,
                });
                return failure_1.Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
            }
            case 'P2025': {
                const message = 'Requested resource cannot be located';
                (0, logger_1.logError)({
                    message,
                    operationName,
                    error,
                    referenceId,
                });
                return failure_1.Failure.notFound(`${message}. Reference Id: ${referenceId}`);
            }
            case 'P2034': {
                const message = 'Error occurs due to a write conflict or a deadlock';
                (0, logger_1.logError)({
                    message,
                    operationName,
                    error,
                    referenceId,
                });
                return failure_1.Failure.notFound(`${message}. Reference Id: ${referenceId}`);
            }
            default: {
                const message = 'Unrecognized known error occurs while processing the request';
                (0, logger_1.logError)({
                    message,
                    operationName,
                    error,
                    referenceId,
                });
                return failure_1.Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
            }
        }
    }
    if (error instanceof library_1.PrismaClientUnknownRequestError) {
        const message = 'Unknown request error occurs';
        (0, logger_1.logError)({
            message,
            operationName,
            error,
            referenceId,
        });
        return failure_1.Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
    }
    if (error instanceof library_1.PrismaClientInitializationError) {
        const message = 'Database initialization error occurs';
        (0, logger_1.logError)({
            message,
            operationName,
            error,
            referenceId,
        });
        return failure_1.Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
    }
    if (error instanceof library_1.PrismaClientRustPanicError) {
        const message = 'Critical error occurs';
        (0, logger_1.logError)({
            message,
            operationName,
            error,
            referenceId,
        });
        return failure_1.Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
    }
    if (error instanceof library_1.PrismaClientValidationError) {
        const message = 'Data provided is not valid';
        (0, logger_1.logError)({
            message,
            operationName,
            error,
            referenceId,
        });
        return failure_1.Failure.badRequest(`${message}. Reference Id: ${referenceId}`);
    }
    (0, logger_1.logError)({
        message: error_message_constant_1.ERROR_MESSAGE.UNRECOGNIZED,
        operationName,
        error,
        referenceId,
    });
    return failure_1.Failure.internalServer(`${error_message_constant_1.ERROR_MESSAGE.UNRECOGNIZED}. Reference Id: ${referenceId}`);
};
/**
 * Checks if an error is a Cloudinary API error
 */
const isCloudinaryApiError = (error) => {
    if (typeof error !== 'object' || error === null)
        return false;
    const hasHttpCodeProperty = 'http_code' in error && !('stack' in error);
    const hasErrorProperty = 'error' in error;
    return hasHttpCodeProperty || hasErrorProperty;
};
/**
 * Handles Cloudinary-specific errors
 */
const handleCloudinaryError = ({ operationName, error, }) => {
    const referenceId = (0, uuid_1.v4)();
    switch (error.http_code) {
        case http_status_codes_1.StatusCodes.BAD_REQUEST: {
            const message = 'Request is not valid';
            (0, logger_1.logError)({
                message,
                operationName,
                error,
            });
            return failure_1.Failure.badRequest(`${message}. Reference Id: ${referenceId}`);
        }
        case http_status_codes_1.StatusCodes.UNAUTHORIZED: {
            const message = 'Authentication signature is not valid';
            (0, logger_1.logError)({
                message,
                operationName,
                error,
                referenceId,
            });
            return failure_1.Failure.unauthorized(`${message}. Reference Id: ${referenceId}`);
        }
        case http_status_codes_1.StatusCodes.NOT_FOUND: {
            const message = 'Requested resource is not found';
            (0, logger_1.logError)({
                message,
                operationName,
                error,
                referenceId,
            });
            return failure_1.Failure.notFound(`${message}. Reference Id: ${referenceId}`);
        }
        default: {
            (0, logger_1.logError)({
                message: error_message_constant_1.ERROR_MESSAGE.UNRECOGNIZED,
                operationName: operationName,
                error,
                referenceId,
            });
            return failure_1.Failure.internalServer(`${error_message_constant_1.ERROR_MESSAGE.UNRECOGNIZED}. Reference Id: ${referenceId}`);
        }
    }
};
//# sourceMappingURL=error-handler.js.map