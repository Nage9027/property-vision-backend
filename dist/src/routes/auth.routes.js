import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { loginSchema, refreshSchema, registerSchema } from '../validators/auth.validator.js';
import { getCurrentUser, loginUser, refreshSession, registerUser } from '../services/auth.service.js';
export const authRoutes = Router();
authRoutes.post('/login', validateBody(loginSchema), async (req, res, next) => {
    try {
        const data = await loginUser(req.body);
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
authRoutes.post('/register', validateBody(registerSchema), async (req, res, next) => {
    try {
        const data = await registerUser(req.body);
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
authRoutes.post('/refresh', validateBody(refreshSchema), async (req, res, next) => {
    try {
        const data = await refreshSession(req.body.refreshToken);
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
authRoutes.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const user = await getCurrentUser(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, data: { user } });
    }
    catch (error) {
        next(error);
    }
});
