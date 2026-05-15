import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .or(z.literal(""))
    .optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const updateData: { email: string; password?: string } = { email };

  if (password) {
    updateData.password = await bcrypt.hash(password, 12);
  }

  try {
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.email, session.user.email));
  } catch (err: unknown) {
    if ((err as { code?: string })?.code === "23505") {
      return NextResponse.json({ error: "That email is already in use" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({
    message: "Profile updated successfully",
    requiresRelogin: email !== session.user.email || !!password,
  });
}
