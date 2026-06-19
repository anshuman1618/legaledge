/**
 * LegalEdge AI - Encryption Utilities
 * AES-256-GCM encryption for sensitive data at rest
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

/**
 * Derives a key from the master encryption key using PBKDF2
 */
function deriveKey(masterKey: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, 32, 'sha256');
}

/**
 * Encrypts sensitive data using AES-256-GCM
 * Format: salt(32) + iv(16) + authTag(16) + ciphertext
 */
export function encryptData(plaintext: string, masterKey?: string): string {
  const key = masterKey || process.env.ENCRYPTION_KEY;
  
  if (!key || key.length < 32) {
    throw new Error('Invalid encryption key: must be at least 32 characters');
  }

  const salt = crypto.randomBytes(SALT_LENGTH);
  const derivedKey = deriveKey(key, salt);
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Combine: salt + iv + authTag + ciphertext
  const combined = Buffer.concat([
    salt,
    iv,
    authTag,
    Buffer.from(encrypted, 'hex')
  ]);
  
  return combined.toString('base64');
}

/**
 * Decrypts data encrypted with AES-256-GCM
 */
export function decryptData(encryptedData: string, masterKey?: string): string {
  const key = masterKey || process.env.ENCRYPTION_KEY;
  
  if (!key || key.length < 32) {
    throw new Error('Invalid encryption key: must be at least 32 characters');
  }

  const combined = Buffer.from(encryptedData, 'base64');
  
  // Extract components
  const salt = combined.subarray(0, SALT_LENGTH);
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = combined.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
  
  const derivedKey = deriveKey(key, salt);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(ciphertext.toString('hex'), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Encrypts a JSON object
 */
export function encryptJSON<T extends object>(data: T, masterKey?: string): string {
  return encryptData(JSON.stringify(data), masterKey);
}

/**
 * Decrypts to a JSON object
 */
export function decryptJSON<T>(encryptedData: string, masterKey?: string): T {
  const decrypted = decryptData(encryptedData, masterKey);
  return JSON.parse(decrypted) as T;
}

/**
 * Hashes sensitive lookup values (e.g., for searchable encryption)
 */
export function hashForLookup(value: string, masterKey?: string): string {
  const key = masterKey || process.env.ENCRYPTION_KEY || '';
  return crypto.createHmac('sha256', key).update(value.toLowerCase()).digest('hex');
}

/**
 * Generates a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
