import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { loginSchema, registerSchema } from '../lib/schemas.js';
const router = Router();
const controller = new AuthController();
router.post('/register', validateRequest(registerSchema), controller.register);
router.post('/login', validateRequest(loginSchema), controller.login);
export default router;
