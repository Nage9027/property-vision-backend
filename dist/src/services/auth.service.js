import { database } from '../config/database.js';
import { hashPassword, verifyPassword } from '../utils/password.utils.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, } from '../utils/jwt.utils.js';
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
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
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
    const user = await database.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(input.password, user.passwordHash)) {
        const error = new Error('Invalid email or password.');
        error.status = 401;
        throw error;
    }
    return createSession(user);
}
export async function getCurrentUser(userId) {
    const user = await database.user.findUnique({ where: { id: userId } });
    if (!user)
        return null;
    return toPublicUser(user);
}
export async function refreshSession(refreshToken) {
    const payload = verifyRefreshToken(refreshToken);
    const user = await database.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
        const error = new Error('Invalid refresh token.');
        error.status = 401;
        throw error;
    }
    return createSession(user);
}
export async function ensureSeedAdmin() {
    const email = 'admin@propertyvision.com';
    const existing = await database.user.findUnique({ where: { email } });
    if (existing)
        return existing;
    return database.user.create({
        data: {
            name: 'Property Vision Admin',
            email,
            phone: null,
            passwordHash: hashPassword('Admin@12345'),
            role: 'ADMIN',
        },
    });
}
