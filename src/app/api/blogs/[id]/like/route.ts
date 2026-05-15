import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { likes } from "@/lib/schema";
import { and, count, eq } from "drizzle-orm";

function getOrCreateFingerprint(): { fingerprint: string; isNew: boolean } {
  const cookieStore = cookies();
  const existing = cookieStore.get("fp")?.value;
  if (existing) return { fingerprint: existing, isNew: false };
  return { fingerprint: crypto.randomUUID(), isNew: true };
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = params.id;

    if (!blogId) {
      return NextResponse.json({ error: "Missing blog id" }, { status: 400 });
    }

    const { fingerprint, isNew } = getOrCreateFingerprint();

    // Toggle: delete if exists, insert if not
    const existing = await db.query.likes.findFirst({
      where: and(eq(likes.blogId, blogId), eq(likes.fingerprint, fingerprint)),
    });

    let liked: boolean;

    if (existing) {
      await db.delete(likes).where(eq(likes.id, existing.id));
      liked = false;
    } else {
      await db.insert(likes).values({ blogId, fingerprint });
      liked = true;
    }

    const [likeRow] = await db
      .select({ likeCount: count() })
      .from(likes)
      .where(eq(likes.blogId, blogId));

    const res = NextResponse.json({ liked, count: Number(likeRow?.likeCount ?? 0) });

    // Persist fingerprint cookie for 30 days if newly generated
    if (isNew) {
      res.cookies.set("fp", fingerprint, {
        httpOnly: true,
        maxAge: 30 * 86_400,
        path: "/",
        sameSite: "lax",
      });
    }

    return res;
  } catch (err) {
    console.error("[API:like]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
