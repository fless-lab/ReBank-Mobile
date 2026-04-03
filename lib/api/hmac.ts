import CryptoJS from 'crypto-js';
import { HMAC_API_SECRET } from './config';

/**
 * Generate HMAC-SHA256 signature for API request signing.
 * Message format: "timestamp.METHOD.path.body_sha256"
 * Must match backend HmacSignatureMiddleware exactly.
 */
export function signRequest(
  method: string,
  path: string,
  body?: string,
): { timestamp: string; signature: string } {
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // SHA-256 hash of the body
  const bodyHash = CryptoJS.SHA256(body || '').toString(CryptoJS.enc.Hex);

  // Build message: "timestamp.METHOD.path.body_sha256"
  const message = `${timestamp}.${method}.${path}.${bodyHash}`;

  // HMAC-SHA256 sign with shared secret
  const signature = CryptoJS.HmacSHA256(message, HMAC_API_SECRET).toString(CryptoJS.enc.Hex);

  return { timestamp, signature };
}
