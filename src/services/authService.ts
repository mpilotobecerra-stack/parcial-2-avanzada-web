import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/AppError.js';

export class AuthService {
  async register(email: string, password: string, role: 'ADMIN' | 'OPERATOR' = 'OPERATOR') {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('El correo ya está registrado', 400);

    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, password: hashed, role },
      select: { id: true, email: true, role: true },
    });
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Credenciales inválidas', 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError('Credenciales inválidas', 401);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'stockflow-secret', {
      expiresIn: '8h',
    });

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
