import { db } from "@/lib/db";
import { blogs, categories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { BlogForm } from "@/components/admin/BlogForm";
import { updateBlog } from "@/lib/actions/blogs";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  let blog;
  let allCategories: { id: string; name: string; slug: string }[] = [];

  try {
    [blog, allCategories] = await Promise.all([
      db.query.blogs.findFirst({ where: eq(blogs.id, params.id) }),
      db.query.categories.findMany(),
    ]);
  } catch (err) {
    console.error("[admin:edit-blog]", err instanceof Error ? err.message : err);
    notFound();
  }

  if (!blog) {
    notFound();
  }

  // Bind the updateBlog action with the blog ID
  const updateBlogWithId = updateBlog.bind(null, blog.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Edit Blog Post
        </h1>
        <p className="mt-2 text-gray-500">
          Make changes to your story.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <BlogForm 
          initialData={blog} 
          categories={allCategories} 
          action={updateBlogWithId} 
        />
      </div>
    </div>
  );
}
