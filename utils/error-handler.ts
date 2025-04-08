import type {UploadApiErrorResponse} from 'cloudinary';
import {StatusCodes} from 'http-status-codes';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import {v4 as uuidv4} from 'uuid';

import {Failure} from './failure';
import {logError, logUnknownError} from './logger';
import {CONSTANT} from './constant';

/**
 * Interface representing generic error handler parameters
 */
interface ErrorHandlerGeneric {
  operationName: string;
  error: Error;
}

/**
 * Interface representing unknown error handler parameters
 */
interface ErrorHandlerUnknown {
  operationName: string;
  error: unknown;
}

/**
 * Interface for handling Cloudinary-specific errors
 */
interface ErrorHandlerCloudinary {
  operationName: string;
  error: UploadApiErrorResponse;
}

/**
 * Handles an error and returns a corresponding failure response
 */
const handleError = ({operationName, error}: ErrorHandlerUnknown): Failure => {
  if (error instanceof Failure) {
    return error;
  }

  if (
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientUnknownRequestError ||
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientRustPanicError ||
    error instanceof PrismaClientValidationError
  ) {
    return handlePrismaError({operationName, error});
  }

  if (isCloudinaryApiError(error)) {
    return handleCloudinaryError({operationName, error});
  }

  if (error instanceof Error) {
    return handleGenericError({operationName, error});
  }

  return handleUnknownError({operationName, error});
};

/**
 * Handles a generic error
 */
const handleGenericError = ({operationName, error}: ErrorHandlerGeneric) => {
  const referenceId = uuidv4();
  const message = CONSTANT.ERROR_MESSAGE.UNRECOGNIZED;
  logError({
    message,
    operationName,
    error,
    referenceId,
  });

  return Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
};

/**
 * Handles an unknown error
 */
const handleUnknownError = ({operationName, error}: ErrorHandlerUnknown) => {
  const referenceId = uuidv4();
  const message = CONSTANT.ERROR_MESSAGE.UNKNOWN;
  logUnknownError({
    message,
    operationName,
    error,
    referenceId,
  });

  return Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
};

/**
 * Handles Prisma-related errors
 */
const handlePrismaError = ({
  operationName,
  error,
}: ErrorHandlerGeneric): Failure => {
  const referenceId = uuidv4();
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2000': {
        const message = 'Input value exceeds the maximum length allowed';
        logError({
          message,
          operationName,
          error,
          referenceId,
        });

        return Failure.badRequest(
          `${message}. Field: ${error.meta?.column_name}, Reference Id: ${referenceId}`,
        );
      }
      case 'P2001': {
        const message = 'Record matching the specified filter is not found';
        logError({
          message,
          operationName,
          error,
          referenceId,
        });

        return Failure.notFound(
          `${message}. Field=${error.meta?.argument_name}, Value: ${error.meta?.argument_value}, Reference Id: ${referenceId}`,
        );
      }
      case 'P2002': {
        const message = 'Unique constraint violation occurs';
        logError({
          message,
          operationName,
          error,
          referenceId,
        });

        return Failure.conflict(
          `${message}. Field: ${error.meta?.constraint}, Reference Id: ${referenceId}`,
        );
      }
      case 'P2003': {
        const message = 'Foreign key constraint violation occurs';
        logError({
          message,
          operationName,
          error,
          referenceId,
        });

        return Failure.badRequest(
          `${message}. Field: ${error.meta?.field_name}, Reference Id: ${referenceId}`,
        );
      }
      case 'P2010': {
        const message = 'Provided query fails';
        logError({
          message,
          operationName,
          error,
          referenceId,
        });

        return Failure.internalServer(
          `${message}. Reference Id: ${referenceId}`,
        );
      }
      case 'P2011': {
        const message = 'Null constraint violation occurs';
        logError({
          message,
          operationName,
          error,
          referenceId,
        });

        return Failure.badRequest(
          `${message}. Field: ${error.meta?.constraint}, Reference Id: ${referenceId}`,
        );
      }
      case 'P2016': {
        const message = 'Error occurs while interpreting the query';
        logError({
          message,
          operationName,
          error,
          referenceId,
        });

        return Failure.internalServer(
          `${message}. Reference Id: ${referenceId}`,
        );
      }
      case 'P2025': {
        const message = 'Requested resource cannot be located';
        logError({
          message,
          operationName,
          error,
          referenceId,
        });

        return Failure.notFound(`${message}. Reference Id: ${referenceId}`);
      }
      case 'P2034': {
        const message = 'Error occurs due to a write conflict or a deadlock';
        logError({
          message,
          operationName,
          error,
          referenceId,
        });

        return Failure.notFound(`${message}. Reference Id: ${referenceId}`);
      }
      default: {
        const message =
          'Unrecognized known error occurs while processing the request';
        logError({
          message,
          operationName,
          error,
          referenceId,
        });

        return Failure.internalServer(
          `${message}. Reference Id: ${referenceId}`,
        );
      }
    }
  }

  if (error instanceof PrismaClientUnknownRequestError) {
    const message = 'Unknown request error occurs';
    logError({
      message,
      operationName,
      error,
      referenceId,
    });

    return Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
  }

  if (error instanceof PrismaClientInitializationError) {
    const message = 'Database initialization error occurs';
    logError({
      message,
      operationName,
      error,
      referenceId,
    });

    return Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
  }

  if (error instanceof PrismaClientRustPanicError) {
    const message = 'Critical error occurs';
    logError({
      message,
      operationName,
      error,
      referenceId,
    });

    return Failure.internalServer(`${message}. Reference Id: ${referenceId}`);
  }

  if (error instanceof PrismaClientValidationError) {
    const message = 'Data provided is not valid';
    logError({
      message,
      operationName,
      error,
      referenceId,
    });

    return Failure.badRequest(`${message}. Reference Id: ${referenceId}`);
  }

  logError({
    message: CONSTANT.ERROR_MESSAGE.UNRECOGNIZED,
    operationName,
    error,
    referenceId,
  });
  return Failure.internalServer(
    `${CONSTANT.ERROR_MESSAGE.UNRECOGNIZED}. Reference Id: ${referenceId}`,
  );
};

/**
 * Checks if an error is a Cloudinary API error
 */
const isCloudinaryApiError = (
  error: unknown,
): error is UploadApiErrorResponse => {
  if (typeof error !== 'object' || error === null) return false;

  const hasHttpCodeProperty = 'http_code' in error && !('stack' in error);
  const hasErrorProperty = 'error' in error;

  return hasHttpCodeProperty || hasErrorProperty;
};

/**
 * Handles Cloudinary-specific errors
 */
const handleCloudinaryError = ({
  operationName,
  error,
}: ErrorHandlerCloudinary): Failure => {
  const referenceId = uuidv4();
  switch (error.http_code) {
    case StatusCodes.BAD_REQUEST: {
      const message = 'Request is not valid';
      logError({
        message,
        operationName,
        error,
      });

      return Failure.badRequest(`${message}. Reference Id: ${referenceId}`);
    }
    case StatusCodes.UNAUTHORIZED: {
      const message = 'Authentication signature is not valid';
      logError({
        message,
        operationName,
        error,
        referenceId,
      });

      return Failure.unauthorized(`${message}. Reference Id: ${referenceId}`);
    }
    case StatusCodes.NOT_FOUND: {
      const message = 'Requested resource is not found';
      logError({
        message,
        operationName,
        error,
        referenceId,
      });

      return Failure.notFound(`${message}. Reference Id: ${referenceId}`);
    }
    default: {
      logError({
        message: CONSTANT.ERROR_MESSAGE.UNRECOGNIZED,
        operationName: operationName,
        error,
        referenceId,
      });

      return Failure.internalServer(
        `${CONSTANT.ERROR_MESSAGE.UNRECOGNIZED}. Reference Id: ${referenceId}`,
      );
    }
  }
};

export {handleError};
