"use server";

import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});

export async function createCategory(formData: FormData) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const validatedFields = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, slug } = validatedFields.data;

  try {
    await db.insert(categories).values({
      name,
      slug,
    });
  } catch (error) {
    return { error: "Failed to create category. Slug might already exist." };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const validatedFields = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, slug } = validatedFields.data;

  try {
    await db
      .update(categories)
      .set({
        name,
        slug,
      })
      .where(eq(categories.id, id));
  } catch (error) {
    return { error: "Failed to update category. Slug might already exist." };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await db.delete(categories).where(eq(categories.id, id));
  } catch (error) {
    return { error: "Failed to delete category. It might be in use by blogs." };
  }

  revalidatePath("/admin/categories");
}
