import { verifyAccessToken } from '../utils/jwt.utils.js';

export function authMiddleware(req, res, next) {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

export function optionalAuthMiddleware(req, _res, next) {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) return next();

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    // Optional auth should not fail the request.
  }

  return next();
}
