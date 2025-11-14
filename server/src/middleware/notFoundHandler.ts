import { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (req: Request, res: Response, _: NextFunction): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};
