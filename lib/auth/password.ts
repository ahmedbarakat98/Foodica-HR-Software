import crypto from "node:crypto";

const SCRYPT_KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [algorithm, salt, hash] = storedHash.split(":");
  if (algorithm !== "scrypt" || !salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex"));
}
