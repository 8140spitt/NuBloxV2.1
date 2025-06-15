import { randomBytes, pbkdf2Sync, timingSafeEqual } from "crypto";

/* ------------ HASHING / VERIFYING ------------ */

const SALT_LENGTH = 16; // bytes
const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

/**
 * Returns "salt:hash" in base64, for storage.
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH);
    const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
    return `${salt.toString('base64')}:${hash.toString('base64')}`;
}

/**
 * Verifies a password against a stored salt:hash string.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
    const [saltB64, hashB64] = stored.split(':');
    if (!saltB64 || !hashB64) return false;
    const salt = Buffer.from(saltB64, 'base64');
    const hash = Buffer.from(hashB64, 'base64');
    const verifyHash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
    return timingSafeEqual(hash, verifyHash);
}