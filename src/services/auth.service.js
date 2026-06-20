import { database } from '../config/database.js';
import { hashPassword, verifyPassword } from '../utils/password.utils.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.utils.js';

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

function createSession(user) {
  const payload = {
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  };

  let accessToken, refreshToken;
  try {
    accessToken = signAccessToken(payload);
    refreshToken = signRefreshToken(payload);
  } catch (err) {
    console.error('[AUTH] JWT signing failed:', err instanceof Error ? err.message : String(err));
    const error = new Error('Authentication service error — JWT secret may be misconfigured.');
    error.status = 500;
    throw error;
  }

  return {
    accessToken,
    token: accessToken,
    refreshToken,
    user: toPublicUser(user),
  };
}

export async function registerUser(input) {
  const email = input.email.trim().toLowerCase();
  const existing = await database.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('Email already registered.');
    error.status = 409;
    throw error;
  }

  const user = await database.user.create({
    data: {
      name: input.name.trim(),
      email,
      phone: input.phone?.trim() || null,
      passwordHash: hashPassword(input.password),
      role: 'USER',
    },
  });

  return createSession(user);
}

export async function loginUser(input) {
  const email = input.email.trim().toLowerCase();
  let user;
  try {
    user = await database.user.findUnique({ where: { email } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[AUTH] Database error during login:', msg);
    const error = new Error(`Database error — ${msg}. Verify that the users table exists and Prisma schema is up to date.`);
    error.status = 500;
    throw error;
  }
  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  return createSession(user);
}

export async function getCurrentUser(userId) {
  const user = await database.user.findUnique({ where: { id: userId } });
  if (!user) return null;
  return toPublicUser(user);
}

export async function refreshSession(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    console.error('[AUTH] Refresh token verification failed:', err instanceof Error ? err.message : String(err));
    const error = new Error('Invalid or expired refresh token.');
    error.status = 401;
    throw error;
  }

  let user;
  try {
    user = await database.user.findUnique({ where: { id: payload.sub } });
  } catch (err) {
    console.error('[AUTH] Database error during refresh:', err instanceof Error ? err.message : String(err));
    const error = new Error(`Database error — ${err instanceof Error ? err.message : String(err)}`);
    error.status = 500;
    throw error;
  }

  if (!user) {
    const error = new Error('Invalid refresh token.');
    error.status = 401;
    throw error;
  }
  return createSession(user);
}

export async function ensureSeedAdmin() {
  const email = 'admin@propertyvision.com';
  let existing;
  try {
    existing = await database.user.findUnique({ where: { email } });
  } catch (err) {
    throw new Error(`Cannot query users table — ${err instanceof Error ? err.message : String(err)}`);
  }
  if (existing) return existing;

  try {
    return await database.user.create({
      data: {
        name: 'Property Vision Admin',
        email,
        phone: null,
        passwordHash: hashPassword('Admin@12345'),
        role: 'ADMIN',
      },
    });
  } catch (err) {
    throw new Error(`Cannot create admin user — ${err instanceof Error ? err.message : String(err)}`);
  }
}
