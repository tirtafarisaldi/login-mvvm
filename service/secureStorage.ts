const encoder = new TextEncoder();
const decoder = new TextDecoder();

let cachedKey: Promise<CryptoKey> | null = null;

const deriveKey = (): Promise<CryptoKey> => {
  if (!cachedKey) {
    cachedKey = (async () => {
      const secret = process.env.nextTokenKey || 'studio-pertunjukan-v1';
      const salt = (
        process.env.nextTokenSalt || 'studio-pertunjukan-v1-salt'
      ).slice(0, 32);
      const baseKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        'PBKDF2',
        false,
        ['deriveKey']
      );
      return crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode(salt),
          iterations: 100_000,
          hash: 'SHA-256',
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    })();
  }
  return cachedKey;
};

const toBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const fromBase64 = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

type EncryptedPayload = { v: string; d: string };

const isEncryptedPayload = (value: unknown): value is EncryptedPayload => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as EncryptedPayload;
  return typeof candidate.v === 'string' && typeof candidate.d === 'string';
};

export const isStorageSupported = (): boolean =>
  typeof window !== 'undefined' &&
  typeof crypto !== 'undefined' &&
  typeof crypto.subtle !== 'undefined';

export const secureSet = async (key: string, value: unknown): Promise<void> => {
  if (!isStorageSupported() || value === undefined || value === null) return;
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyObj = await deriveKey();
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    keyObj,
    encoder.encode(JSON.stringify(value))
  );
  const payload: EncryptedPayload = {
    v: toBase64(iv),
    d: toBase64(new Uint8Array(cipher)),
  };
  localStorage.setItem(key, JSON.stringify(payload));
};

export const secureGet = async <T>(key: string): Promise<T | null> => {
  if (!isStorageSupported()) return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isEncryptedPayload(parsed)) return null;
    const iv = fromBase64(parsed.v);
    const keyObj = await deriveKey();
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      keyObj,
      fromBase64(parsed.d)
    );
    return JSON.parse(decoder.decode(plain)) as T;
  } catch {
    return null;
  }
};

export const secureRemove = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
};
