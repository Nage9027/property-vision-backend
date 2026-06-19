import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

const ITERATIONS = 120_000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash.startsWith('pbkdf2$')) {
    return password === storedHash;
  }

  const [, iterationsRaw, salt, expectedHash] = storedHash.split('$');
  const iterations = Number(iterationsRaw);
  if (!Number.isFinite(iterations) || !salt || !expectedHash) return false;

  const actualHash = pbkdf2Sync(password, salt, iterations, expectedHash.length / 2, DIGEST);
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  if (expectedBuffer.length !== actualHash.length) return false;
  return timingSafeEqual(expectedBuffer, actualHash);
}
