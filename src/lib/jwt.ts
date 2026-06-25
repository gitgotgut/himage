import { SignJWT, jwtVerify } from 'jose';

// Get keys from environment variables
const privateKey = process.env.JWT_PRIVATE_KEY;
const publicKey = process.env.JWT_PUBLIC_KEY;

if (!privateKey || !publicKey) {
  throw new Error('JWT_PRIVATE_KEY and JWT_PUBLIC_KEY must be set in environment variables');
}

const secret = new TextEncoder().encode(privateKey);
const publicSecret = new TextEncoder().encode(publicKey);

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  displayName?: string;
  platforms: string[]; // ['hugo', 'plans', 'photo']
  iat?: number;
  exp?: number;
}

// Generate JWT token (RS256)
export async function generateToken(
  payload: JWTPayload,
  expiresIn: number = 900 // 15 minutes in seconds
): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(secret);

  return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, publicSecret);
    return verified.payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Extract token from Authorization header
export function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer') return null;
  return token;
}
