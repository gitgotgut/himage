import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { randomBytes, createHash } from "crypto";
import { addMinutes } from "date-fns";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = z.object({ email: z.string().email() }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = parsed.data;

  // Always return success to avoid leaking which emails are registered
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const rawToken = randomBytes(32).toString("hex");
  const hashedToken = createHash("sha256").update(rawToken).digest("hex");
  const expiry = addMinutes(new Date(), 15);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: hashedToken, passwordResetExpiry: expiry },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`;
  const fromAddress = process.env.EMAIL_FROM || "Hugo <onboarding@resend.dev>";

  const { error: sendError } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: "Reset your Hugo password",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 16px;color:#111">
          <div style="margin-bottom:24px">
            <span style="font-size:18px;font-weight:700;letter-spacing:-0.5px">Hugo</span>
          </div>
          <h2 style="font-size:20px;font-weight:600;margin:0 0 8px">Reset your password</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 20px">
            Click the button below to set a new password. This link expires in 15 minutes.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">
            Reset password
          </a>
          <p style="margin-top:24px;font-size:12px;color:#9ca3af">
            If you didn&apos;t request a password reset, you can safely ignore this email.
          </p>
        </body>
      </html>
    `,
  });
  if (sendError) {
    console.error("Failed to send reset email:", sendError);
    // Still return ok — token is saved, user can retry
  }

  return NextResponse.json({ ok: true });
}
