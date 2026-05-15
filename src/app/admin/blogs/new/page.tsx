import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { BlogForm } from "@/components/admin/BlogForm";
import { createBlog } from "@/lib/actions/blogs";
import { safeQuery } from "@/lib/safe-query";

export default async function NewBlogPage() {
  const allCategories = await safeQuery(
    "admin:new-blog:categories",
    () => db.query.categories.findMany(),
    []
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Create New Blog
        </h1>
        <p className="mt-2 text-gray-500">
          Write and publish your next story.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <BlogForm categories={allCategories} action={createBlog} />
      </div>
    </div>
  );
}
