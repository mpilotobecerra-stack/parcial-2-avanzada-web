import { prisma } from '../lib/prisma.js';
export class ProductService {
    list(category) {
        return prisma.product.findMany({
            where: category ? { category: { name: category } } : undefined,
            include: { category: true },
            orderBy: { id: 'asc' },
        });
    }
    create(data) {
        return prisma.product.create({ data, include: { category: true } });
    }
    update(id, data) {
        return prisma.product.update({ where: { id }, data, include: { category: true } });
    }
    remove(id) {
        return prisma.product.delete({ where: { id } });
    }
    async lowStock() {
        const products = await prisma.product.findMany({ include: { category: true } });
        return products.filter((product) => product.stock <= product.minStock).sort((a, b) => a.stock - b.stock);
    }
}
