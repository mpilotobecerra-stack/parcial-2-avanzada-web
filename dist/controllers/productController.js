import { ProductService } from '../services/productService.js';
const productService = new ProductService();
export class ProductController {
    list = async (req, res, next) => {
        try {
            const category = typeof req.query.category === 'string' ? req.query.category : undefined;
            const products = await productService.list(category);
            res.json(products);
        }
        catch (error) {
            next(error);
        }
    };
    create = async (req, res, next) => {
        try {
            const product = await productService.create(req.body);
            res.status(201).json(product);
        }
        catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const product = await productService.update(Number(req.params.id), req.body);
            res.json(product);
        }
        catch (error) {
            next(error);
        }
    };
    remove = async (req, res, next) => {
        try {
            await productService.remove(Number(req.params.id));
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
    lowStock = async (_req, res, next) => {
        try {
            const low = await productService.lowStock();
            res.json(low);
        }
        catch (error) {
            next(error);
        }
    };
}
