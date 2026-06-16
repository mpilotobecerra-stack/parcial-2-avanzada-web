import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/AppError.js';

export class OrderService {
  async create(operatorId: string, items: Array<{ productId: number; quantity: number }>) {
    if (!items.length) throw new AppError('Debe incluir al menos un ítem', 400);

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new AppError('Producto no encontrado', 404);
        if (product.stock < item.quantity) throw new AppError(`Stock insuficiente para ${product.name}`, 400);
      }

      const order = await tx.order.create({ data: { operatorId, status: 'PENDING' } });

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new AppError('Producto no encontrado', 404);

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtOrder: product.price,
          },
        });
      }

      return tx.order.findUniqueOrThrow({
        where: { id: order.id },
        include: { items: { include: { product: true } }, operator: true },
      });
    });
  }

  async findById(id: number) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, operator: true },
    });
  }

  async updateStatus(id: number, status: 'PENDING' | 'DISPATCHED' | 'CANCELLED') {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!order) throw new AppError('Pedido no encontrado', 404);

    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
        return tx.order.update({ where: { id }, data: { status }, include: { items: { include: { product: true } }, operator: true } });
      });
    }

    return prisma.order.update({ where: { id }, data: { status }, include: { items: { include: { product: true } }, operator: true } });
  }
}
