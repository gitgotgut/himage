import { extractToken, verifyToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'No token provided' },
        { status: 400 }
      );
    }

    // Verify JWT token
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        user: {
          id: payload.sub,
          email: payload.email,
          displayName: payload.displayName,
        },
        platforms: payload.platforms,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Validate endpoint error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
