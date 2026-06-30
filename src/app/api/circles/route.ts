import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMyCircles } from "@/lib/circles";

// GET /api/circles — the user's circles, for the share picker
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getMyCircles(session.user.id));
}
