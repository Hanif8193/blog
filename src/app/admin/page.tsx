import { db } from "@/lib/db";
import { blogs, categories } from "@/lib/schema";
import { count, eq } from "drizzle-orm";
import { StatCard } from "@/components/admin/StatCard";
import { FileText, Globe, Tags } from "lucide-react";

export default async function AdminDashboard() {
  let totalBlogs = 0;
  let publishedBlogs = 0;
  let totalCategories = 0;

  try {
    const [row] = await db.select({ value: count() }).from(blogs);
    totalBlogs = Number(row?.value ?? 0);
  } catch (err) {
    console.error("[Admin:totalBlogs]", err instanceof Error ? err.message : err);
  }

  try {
    const [row] = await db.select({ value: count() }).from(blogs).where(eq(blogs.published, true));
    publishedBlogs = Number(row?.value ?? 0);
  } catch (err) {
    console.error("[Admin:publishedBlogs]", err instanceof Error ? err.message : err);
  }

  try {
    const [row] = await db.select({ value: count() }).from(categories);
    totalCategories = Number(row?.value ?? 0);
  } catch (err) {
    console.error("[Admin:categories]", err instanceof Error ? err.message : err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-500">
          Overview of your blog platform's content and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Blogs"
          value={totalBlogs}
          description="Across all drafts and published"
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard
          title="Published Blogs"
          value={publishedBlogs}
          description="Live on the public website"
          icon={<Globe className="h-6 w-6" />}
        />
        <StatCard
          title="Categories"
          value={totalCategories}
          description="Active blog categories"
          icon={<Tags className="h-6 w-6" />}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <h3 className="text-lg font-semibold text-gray-900">Welcome back!</h3>
        <p className="mt-2 text-sm text-gray-600">
          Use the sidebar to manage your blog posts and categories. You can create new content, 
          edit existing posts, or manage your organization system.
        </p>
      </div>
    </div>
  );
}
