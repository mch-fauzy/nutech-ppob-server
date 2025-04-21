import { Response } from 'express';
declare const responseWithDetails: (res: Response, code: number, status: number, message: string, data: object | null) => void;
export { responseWithDetails };
