import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Failure } from '../utils/failure';
import { responseWithDetails } from '../utils/response'
import { logger } from '../configs/winston';
import { CONSTANT } from '../utils/constant';

// NextFunction must be included to make error handler middleware to work properly
const errorHandler = (error: Failure | Error, req: Request, res: Response, next: NextFunction) => {
    // Handle custom errors
    if (error instanceof Failure && error.name === 'Failure') {
        responseWithDetails(res, error.code, error.status, error.message, null);
        return;
    }

    // Handle validation errors for Joi validator
    if (error instanceof Error && error.name === 'ValidationError') {
        responseWithDetails(res, StatusCodes.BAD_REQUEST, CONSTANT.STATUS.BAD_REQUEST, error.message, null);
        return;
    }

    // Handle unexpected errors
    logger.error(`[errorHandler] Unexpected error: ${error}`);
    responseWithDetails(res, StatusCodes.INTERNAL_SERVER_ERROR, CONSTANT.STATUS.INTERNAL_SERVER_ERROR, 'Internal server error', null);
    next();
};

export { errorHandler };