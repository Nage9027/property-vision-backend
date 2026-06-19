import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { loginSchema, refreshSchema, registerSchema } from '../validators/auth.validator.js';
import * as authController from '../controllers/auth.controller.js';

export const authRoutes = Router();

authRoutes.post('/login', validateBody(loginSchema), authController.login);
authRoutes.post('/register', validateBody(registerSchema), authController.register);
authRoutes.post('/refresh', validateBody(refreshSchema), authController.refresh);
authRoutes.get('/me', authMiddleware, authController.getMe);
