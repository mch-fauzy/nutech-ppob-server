import { Request, Response, NextFunction } from 'express';
declare class AuthMiddleware {
    static authenticateToken: (req: Request, res: Response, next: NextFunction) => void;
}
export { AuthMiddleware };
