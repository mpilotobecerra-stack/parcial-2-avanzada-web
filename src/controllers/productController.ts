import { NextFunction, Request, Response } from 'express';
import { ProductService } from '../services/productService.js';

const productService = new ProductService();

export class ProductController {
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const products = await productService.list(category);
      res.json(products);
    } catch (error) { next(error); }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (error) { next(error); }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.update(Number(req.params.id), req.body);
      res.json(product);
    } catch (error) { next(error); }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await productService.remove(Number(req.params.id));
      res.status(204).send();
    } catch (error) { next(error); }
  };

  lowStock = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const low = await productService.lowStock();
      res.json(low);
    } catch (error) { next(error); }
  };
}
