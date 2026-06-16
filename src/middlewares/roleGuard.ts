import { NextFunction, Response } from 'express';
import { AppError } from '../utils/AppError.js';
import { AuthRequest } from './authMiddleware.js';

export function roleGuard(allowedRoles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('No autorizado para esta operación', 403));
    }
    next();
  };
}
