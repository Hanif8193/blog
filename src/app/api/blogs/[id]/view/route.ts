import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { blogs } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing blog id" }, { status: 400 });
    }

    const cookieStore = cookies();
    const cookieName = `vb_${id}`;

    // Already counted in last 24 h — return current count without incrementing
    if (cookieStore.has(cookieName)) {
      const [blog] = await db
        .select({ views: blogs.views })
        .from(blogs)
        .where(eq(blogs.id, id));
      return NextResponse.json({ views: blog?.views ?? 0 });
    }

    // Atomic increment
    const [updated] = await db
      .update(blogs)
      .set({ views: sql`${blogs.views} + 1` })
      .where(eq(blogs.id, id))
      .returning({ views: blogs.views });

    const res = NextResponse.json({ views: updated?.views ?? 0 });

    res.cookies.set(cookieName, "1", {
      httpOnly: true,
      maxAge: 86_400,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("[API:view]", err instanceof Error ? err.message : err);
    return NextResponse.json({ views: 0 }, { status: 200 }); // 200 — client ignores this silently
  }
}
