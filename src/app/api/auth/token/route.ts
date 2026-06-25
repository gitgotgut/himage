import { generateToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const tokenSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = tokenSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = await compare(parsed.data.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token for cross-platform auth
    const token = await generateToken({
      sub: user.id,
      email: user.email,
      displayName: user.displayName || undefined,
      platforms: ['hugo', 'plans', 'photo'], // User has access to all platforms by default
    });

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
