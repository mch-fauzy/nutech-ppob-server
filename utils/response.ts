import { Response } from 'express';

const responseWithDetails = (res: Response, code: number, status: number, message: string, data: object | null) => {
    res.status(code).json({ status: status, message: message, data: data });
};

export { responseWithDetails };
