import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

import {Failure} from '../utils/failure';
import {responseWithDetails} from '../utils/response';
import {CONSTANT} from '../utils/constant';
import {logUnknownError} from '../utils/logger';

class ErrorResponseMiddleware {
  // NextFunction must be included to make error response handler middleware to work properly
  static handler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    // Response with known errors
    if (error instanceof Failure && error.name === 'Failure') {
      responseWithDetails(res, error.code, error.status, error.message, null);
      return;
    }

    // Response with validation errors for Joi validator
    if (error instanceof Error && error.name === 'ValidationError') {
      responseWithDetails(
        res,
        StatusCodes.BAD_REQUEST,
        CONSTANT.INTERNAL_STATUS_CODE.BAD_REQUEST,
        error.message,
        null,
      );
      return;
    }

    // Response with unknown errors
    logUnknownError({
      message: CONSTANT.ERROR_MESSAGE.UNKNOWN,
      operationName: 'errorApiResponseHandler',
      error: error,
    });

    responseWithDetails(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      CONSTANT.INTERNAL_STATUS_CODE.SERVER_ERROR,
      CONSTANT.ERROR_MESSAGE.UNKNOWN,
      null,
    );
    next();
  };
}

export {ErrorResponseMiddleware};
