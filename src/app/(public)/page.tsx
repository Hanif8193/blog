import { db } from "@/lib/db";
import { blogs } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { BlogCard } from "@/components/blog/BlogCard";
import { safeQuery } from "@/lib/safe-query";
import Link from "next/link";

export default async function Home() {
  const latestBlogs = await safeQuery(
    "home:latestBlogs",
    () =>
      db.query.blogs.findMany({
        where: eq(blogs.published, true),
        orderBy: [desc(blogs.createdAt)],
        limit: 6,
        with: { category: true },
      }),
    []
  );

  return (
    <div className="animate-fade-in space-y-20 py-10">

      {/* ── Hero ── */}
      <section className="space-y-6 py-10 text-center">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600">
          Welcome to ModernBlog
        </span>

        <h1 className="text-balance text-5xl font-extrabold tracking-tight text-gray-950 md:text-6xl">
          Ideas Worth{" "}
          <span className="text-blue-600">Reading</span>
        </h1>

        <p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-gray-500">
          A clean, distraction-free space for high-quality stories on tech, travel, food, and design.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Browse all stories
          </Link>
        </div>
      </section>

      {/* ── Latest posts ── */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-950">Latest Stories</h2>
          <Link href="/blogs" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>

        {latestBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                excerpt={blog.excerpt}
                slug={blog.slug}
                image={blog.image}
                category={blog.category}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="No stories yet — check back soon." />
        )}
      </section>

    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="rounded-2xl border-2 border-dashed border-gray-200 px-16 py-12 text-center">
        <p className="text-lg font-semibold text-gray-400">{message}</p>
      </div>
    </div>
  );
}
