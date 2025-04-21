import {Response} from 'express';

const responseWithDetails = (
  res: Response,
  code: number,
  status: number,
  message: string,
  data: object | null,
) => {
  /** Disable caching for browser */
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(code).json({status: status, message: message, data: data});
};

export {responseWithDetails};
