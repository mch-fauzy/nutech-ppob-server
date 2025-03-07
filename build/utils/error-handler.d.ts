import { Failure } from './failure';
/**
 * Interface representing unknown error handler parameters
 */
interface ErrorHandlerUnknown {
    operationName: string;
    error: unknown;
}
/**
 * Handles an error and returns a corresponding failure response
 */
declare const handleError: ({ operationName, error }: ErrorHandlerUnknown) => Failure;
export { handleError };
