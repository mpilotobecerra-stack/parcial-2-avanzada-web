import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
export function authMiddleware(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Token de acceso requerido', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET || 'stockflow-secret';
        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    }
    catch {
        next(new AppError('Token inválido o expirado', 401));
    }
}
