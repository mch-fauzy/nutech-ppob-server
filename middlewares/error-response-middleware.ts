import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

import {Failure} from '../common/utils/errors/failure';
import {responseWithDetails} from '../common/utils/http/response';
import {INTERNAL_STATUS_CODE} from '../common/constants/internal-status-code-constant';
import {ERROR_MESSAGE} from '../common/constants/error-message-constant';
import {logUnknownError} from '../common/utils/logging/logger';

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
        INTERNAL_STATUS_CODE.BAD_REQUEST,
        error.message,
        null,
      );
      return;
    }

    // Response with unknown errors
    logUnknownError({
      message: ERROR_MESSAGE.UNKNOWN,
      operationName: 'errorApiResponseHandler',
      error: error,
    });

    responseWithDetails(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      INTERNAL_STATUS_CODE.SERVER_ERROR,
      ERROR_MESSAGE.UNKNOWN,
      null,
    );
    next();
  };
}

export {ErrorResponseMiddleware};
