import { createSecretKey } from "crypto"
import { SignJWT, jwtVerify } from "jose"

import { User } from "src/entities"

const ENV_JWT_EXPIRATION_TIME = "3h"
const ENV_JWT_SECRET = "NwiZTIwMzQzOSwiZXh"

type TokenPayload = { id: string }

export async function generateJWT(user: User) {
  const secret = createSecretKey(ENV_JWT_SECRET, "utf-8")
  const tokenPayload = { id: user.id }

  const token = await new SignJWT(tokenPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ENV_JWT_EXPIRATION_TIME)
    .sign(secret)

  return token
}

export async function validateToken(
  accessToken: string,
): Promise<TokenPayload | false> {
  const secret = createSecretKey(ENV_JWT_SECRET, "utf-8")
  try {
    const { payload } = await jwtVerify<TokenPayload>(accessToken, secret)
    if (!payload?.id) return false
    return payload
  } catch (e) {
    return false
  }
}
