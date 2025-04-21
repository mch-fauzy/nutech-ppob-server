import {winstonLogger} from '../../../configs/winston';
import {REGEX} from '../../constants/regex-constant';

/**
 * Base interface for all log details
 */
interface LogBase {
  message: string;
  operationName: string;
  referenceId?: string;
}

/**
 * Interface for logging generic errors
 */
interface LogGenericError extends LogBase {
  error: Error;
}

/**
 * Interface for logging unknown errors
 */
interface LogUnknownError extends LogBase {
  error: unknown;
}

/**
 * Logs generic errors using Winston logger
 */
const logError = ({
  message,
  operationName,
  error,
  referenceId,
}: LogGenericError): void => {
  winstonLogger.error({
    message,
    operation: operationName,
    reason: error.message?.replace(REGEX.NEW_LINE, ' ').trim(),
    detail: error,
    referenceId,
  });
};

/**
 * Logs unknown errors using Winston logger
 */
const logUnknownError = ({
  message,
  operationName,
  error,
  referenceId,
}: LogUnknownError): void => {
  winstonLogger.error({
    message,
    operation: operationName,
    detail: error,
    referenceId,
  });
};

/**
 * Logs informational messages using Winston logger
 */
const logInfo = (message: string): void => {
  winstonLogger.info(message);
};

export {logError, logUnknownError, logInfo};
