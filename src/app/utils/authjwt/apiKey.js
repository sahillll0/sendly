import crypto from 'crypto';

/**
 * Generates a secure API key with an `sk_` prefix
 * @returns {string} The generated API key
 */
export function generateApiKey() {
  const buffer = crypto.randomBytes(32);
  return `sk_${buffer.toString('hex')}`;
}
