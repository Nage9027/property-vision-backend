import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signJwt(payload) {
  return signAccessToken(payload);
}

export function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.REFRESH_JWT_SECRET, { expiresIn: '30d' });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.REFRESH_JWT_SECRET);
}
