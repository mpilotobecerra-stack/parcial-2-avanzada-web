import { z } from 'zod';
export const registerSchema = z.object({
    email: z.string().email('Ingrese un correo válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['ADMIN', 'OPERATOR']).optional(),
});
export const loginSchema = z.object({
    email: z.string().email('Ingrese un correo válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
export const productSchema = z.object({
    name: z.string().min(2),
    sku: z.string().min(1),
    stock: z.number().int().nonnegative(),
    minStock: z.number().int().nonnegative(),
    price: z.number().positive(),
    categoryId: z.number().int().positive(),
});
export const orderSchema = z.object({
    items: z.array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
    })).min(1),
});
export const statusSchema = z.object({
    status: z.enum(['PENDING', 'DISPATCHED', 'CANCELLED']),
});
