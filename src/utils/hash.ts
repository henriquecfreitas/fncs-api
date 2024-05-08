import { createHash, scryptSync, timingSafeEqual } from "crypto"

const ENCODING = "base64"

export function hashKey(key: string, salt: string) {
  return scryptSync(key, createHash("sha256").update(salt).digest(ENCODING), 32)
}

export function parseHashBuffer(hash: Buffer) {
  return hash.toString(ENCODING)
}

export function validateHash(providedHash: Buffer, validHash: string) {
  return timingSafeEqual(providedHash, Buffer.from(validHash, ENCODING))
}
