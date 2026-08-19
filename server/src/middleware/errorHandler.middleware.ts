import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
