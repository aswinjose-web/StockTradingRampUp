import { z } from 'zod';
export const vaultSchema = z.object({ version: z.literal(1), salt: z.string(), iv: z.string(), ciphertext: z.string(), iterations: z.literal(310000) });
export type Vault = z.infer<typeof vaultSchema>;
const encode = (b: Uint8Array) => btoa(String.fromCharCode(...b));
const decode = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function key(passphrase: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt as BufferSource, iterations: 310000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
export async function encryptToken(token: string, passphrase: string): Promise<Vault> {
  if (passphrase.length < 12) throw new Error('Use a passphrase of at least 12 characters.');
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await key(passphrase, salt), new TextEncoder().encode(token));
  return { version: 1, salt: encode(salt), iv: encode(iv), ciphertext: encode(new Uint8Array(encrypted)), iterations: 310000 };
}
export async function decryptToken(vault: Vault, passphrase: string) {
  const v = vaultSchema.parse(vault);
  try { const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: decode(v.iv) as BufferSource }, await key(passphrase, decode(v.salt)), decode(v.ciphertext) as BufferSource); return new TextDecoder().decode(plain); }
  catch { throw new Error('Could not unlock. Check your passphrase or remove the saved credential.'); }
}
