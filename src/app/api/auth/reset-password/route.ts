import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { createHash } from "crypto";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = z
    .object({
      token: z.string().min(1),
      password: z.string().min(8, "Password must be at least 8 characters"),
    })
    .safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;
  const hashedToken = createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 }
    );
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
  });

  return NextResponse.json({ ok: true });
}
