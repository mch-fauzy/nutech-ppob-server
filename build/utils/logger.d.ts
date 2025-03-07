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
declare const logError: ({ message, operationName, error, referenceId, }: LogGenericError) => void;
/**
 * Logs unknown errors using Winston logger
 */
declare const logUnknownError: ({ message, operationName, error, referenceId, }: LogUnknownError) => void;
/**
 * Logs informational messages using Winston logger
 */
declare const logInfo: (message: string) => void;
export { logError, logUnknownError, logInfo };
