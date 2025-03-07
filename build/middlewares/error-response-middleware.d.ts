import { NextFunction, Request, Response } from 'express';
declare class ErrorResponseMiddleware {
    static handler: (error: unknown, req: Request, res: Response, next: NextFunction) => void;
}
export { ErrorResponseMiddleware };
