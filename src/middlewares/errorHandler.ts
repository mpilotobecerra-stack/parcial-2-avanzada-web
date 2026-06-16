import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof Error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }

  return res.status(500).json({ message: 'Error interno del servidor' });
}
