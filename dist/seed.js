import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma.js';
async function main() {
    await prisma.category.createMany({
        data: [
            { name: 'Electrónica' },
            { name: 'Hogar' },
        ],
    });
    const adminExists = await prisma.user.findUnique({ where: { email: 'admin@stockflow.local' } });
    if (!adminExists) {
        await prisma.user.create({
            data: {
                email: 'admin@stockflow.local',
                password: await bcrypt.hash('admin123', 10),
                role: 'ADMIN',
            },
        });
    }
    const operatorExists = await prisma.user.findUnique({ where: { email: 'operator@stockflow.local' } });
    if (!operatorExists) {
        await prisma.user.create({
            data: {
                email: 'operator@stockflow.local',
                password: await bcrypt.hash('operator123', 10),
                role: 'OPERATOR',
            },
        });
    }
    const categories = await prisma.category.findMany();
    if ((await prisma.product.count()) === 0) {
        await prisma.product.createMany({
            data: [
                { name: 'Laptop', sku: 'SKU-001', stock: 5, minStock: 2, price: 799.99, categoryId: categories[0]?.id ?? 1 },
                { name: 'Mouse', sku: 'SKU-002', stock: 1, minStock: 2, price: 25.5, categoryId: categories[0]?.id ?? 1 },
                { name: 'Silla', sku: 'SKU-003', stock: 8, minStock: 3, price: 120, categoryId: categories[1]?.id ?? 2 },
            ],
        });
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
