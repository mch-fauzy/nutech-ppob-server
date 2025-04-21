import {StatusCodes} from 'http-status-codes';

import {INTERNAL_STATUS_CODE} from '../../constants/internal-status-code-constant';

class Failure extends Error {
  /* Custom properties */
  code: number;
  status: number;

  constructor(message: string, code: number, status: number) {
    super(
      message,
    ); /* Call the constructor of its parent class to access the parent's properties and methods */
    this.code = code;
    this.status = status;
    this.name = 'Failure';

    /* Showing only the relevant function calls leading to the error */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Failure);
    }
  }

  static notFound = (message: string) => {
    return new Failure(
      message,
      StatusCodes.NOT_FOUND,
      INTERNAL_STATUS_CODE.NOT_FOUND,
    );
  };

  static unauthorized = (message: string) => {
    return new Failure(
      message,
      StatusCodes.UNAUTHORIZED,
      INTERNAL_STATUS_CODE.UNAUTHORIZED,
    );
  };

  static invalidCredentials = (message: string) => {
    return new Failure(
      message,
      StatusCodes.UNAUTHORIZED,
      INTERNAL_STATUS_CODE.INVALID_CREDENTIALS,
    );
  };

  static internalServer = (message: string) => {
    return new Failure(
      message,
      StatusCodes.INTERNAL_SERVER_ERROR,
      INTERNAL_STATUS_CODE.SERVER_ERROR,
    );
  };

  static badRequest = (message: string) => {
    return new Failure(
      message,
      StatusCodes.BAD_REQUEST,
      INTERNAL_STATUS_CODE.BAD_REQUEST,
    );
  };

  static conflict = (message: string) => {
    return new Failure(
      message,
      StatusCodes.CONFLICT,
      INTERNAL_STATUS_CODE.CONFLICT,
    );
  };
}

export {Failure};
