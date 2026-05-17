"use server";

import { db } from "@/lib/db";
import { blogs } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  image: z.string().optional(),
  categoryId: z.string().uuid("Invalid category"),
  published: z.boolean().default(false),
});

export async function createBlog(formData: FormData) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const authorId = (session.user as any).id as string | undefined;
  if (!authorId) {
    return { error: "Your session has expired. Please sign out and sign in again." };
  }

  const validatedFields = blogSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    excerpt: (formData.get("excerpt") as string) || undefined,
    image: (formData.get("image") as string) || undefined,
    categoryId: formData.get("categoryId"),
    published: formData.get("published") === "on",
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { title, slug, content, excerpt, image, categoryId, published } = validatedFields.data;

  try {
    await db.insert(blogs).values({
      title,
      slug,
      content,
      excerpt,
      image,
      categoryId,
      published,
      authorId,
    });
  } catch (error: any) {
    if (error?.code === "23505") {
      return { error: "A blog with this slug already exists. Please use a different slug." };
    }
    console.error("[createBlog]", error?.message ?? error);
    return { error: "Failed to create blog post. Please try again." };
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/");
  redirect("/admin/blogs");
}

export async function updateBlog(id: string, formData: FormData) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const validatedFields = blogSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    excerpt: (formData.get("excerpt") as string) || undefined,
    image: (formData.get("image") as string) || undefined,
    categoryId: formData.get("categoryId"),
    published: formData.get("published") === "on",
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { title, slug, content, excerpt, image, categoryId, published } = validatedFields.data;

  try {
    await db
      .update(blogs)
      .set({
        title,
        slug,
        content,
        excerpt,
        image,
        categoryId,
        published,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, id));
  } catch (error: any) {
    if (error?.code === "23505") {
      return { error: "A blog with this slug already exists. Please use a different slug." };
    }
    console.error("[updateBlog]", error?.message ?? error);
    return { error: "Failed to update blog post. Please try again." };
  }

  revalidatePath("/admin/blogs");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blogs");
  revalidatePath("/");
  redirect("/admin/blogs");
}

export async function deleteBlog(id: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  try {
    await db.delete(blogs).where(eq(blogs.id, id));
  } catch (error) {
    return { error: "Failed to delete blog post." };
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  revalidatePath("/");
}
