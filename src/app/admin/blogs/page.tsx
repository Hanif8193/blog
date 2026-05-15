import { db } from "@/lib/db";
import { blogs } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton";
import { Edit } from "lucide-react";
import { safeQuery } from "@/lib/safe-query";

export default async function AdminBlogsPage() {
  const allBlogs = await safeQuery(
    "admin:blogs",
    () =>
      db.query.blogs.findMany({
        orderBy: [desc(blogs.createdAt)],
        with: { category: true },
      }),
    []
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Manage Blogs
          </h1>
          <p className="mt-2 text-gray-500">
            Create, edit, or delete your blog posts.
          </p>
        </div>
        <Link href="/admin/blogs/new">
          <Button variant="primary" size="md">
            Create New Blog
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allBlogs.length > 0 ? (
              allBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                    {blog.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {blog.category?.name || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4">
                    {blog.published ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(blog.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/admin/blogs/${blog.id}/edit`}>
                      <Button variant="secondary" size="sm" className="p-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteBlogButton id={blog.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No blogs found. Start by creating your first post!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
