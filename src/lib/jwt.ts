import { SignJWT, jwtVerify } from 'jose';

/**
 * Cross-platform auth tokens (HS256).
 *
 * All hifamily platforms (hifamily, hiplan, himage, hugo) share a single
 * `JWT_SECRET`. hifamily mints short-lived handoff tokens during SSO; the
 * consumer platforms verify them with the same secret and then establish
 * their own local session. The secret must be identical everywhere.
 */

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET must be set in environment variables');
  }
  return new TextEncoder().encode(secret);
}

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  displayName?: string;
  platforms: string[]; // ['hugo', 'plans', 'photo']
  iat?: number;
  exp?: number;
}

// Generate a short-lived SSO handoff token (HS256). Default 5 minutes.
export async function generateToken(
  payload: JWTPayload,
  expiresIn: number = 300
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(getSecret());
}

// Verify a token and return its payload, or null if invalid/expired.
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ['HS256'],
    });
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// Extract a bearer token from an Authorization header.
export function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer') return null;
  return token;
}
