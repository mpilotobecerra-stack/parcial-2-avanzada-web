import { AppError } from '../utils/AppError.js';
export function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    if (err instanceof Error) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
    return res.status(500).json({ message: 'Error interno del servidor' });
}
