import { AppError } from '../utils/AppError.js';
export function validateRequest(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return next(new AppError('Datos inválidos', 400));
        }
        req.body = result.data;
        next();
    };
}
