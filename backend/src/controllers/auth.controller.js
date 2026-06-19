import { getCurrentUser, loginUser, refreshSession, registerUser } from '../services/auth.service.js';

export async function login(req, res, next) {
  try {
    const data = await loginUser(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  try {
    const data = await registerUser(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const data = await refreshSession(req.body.refreshToken);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await getCurrentUser(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
}
