import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleGuard } from '../middlewares/roleGuard.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { productSchema } from '../lib/schemas.js';

const router = Router();
const controller = new ProductController();

router.get('/', controller.list);
router.get('/low-stock', authMiddleware, roleGuard(['ADMIN']), controller.lowStock);
router.post('/', authMiddleware, roleGuard(['ADMIN']), validateRequest(productSchema), controller.create);
router.put('/:id', authMiddleware, roleGuard(['ADMIN']), validateRequest(productSchema), controller.update);
router.delete('/:id', authMiddleware, roleGuard(['ADMIN']), controller.remove);

export default router;
