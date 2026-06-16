import { AppError } from '../utils/AppError.js';
export function roleGuard(allowedRoles) {
    return (req, _res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new AppError('No autorizado para esta operación', 403));
        }
        next();
    };
}
