import { db } from "@/lib/db";
import { categories, blogs } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { safeQuery } from "@/lib/safe-query";
import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const categoryWithBlogs = await safeQuery(
    "category:single",
    () =>
      db.query.categories.findFirst({
        where: eq(categories.slug, params.slug),
        with: {
          blogs: {
            where: eq(blogs.published, true),
            orderBy: [desc(blogs.createdAt)],
          },
        },
      }),
    null
  );

  if (!categoryWithBlogs) notFound();

  const { name, slug, blogs: categoryBlogs } = categoryWithBlogs;

  return (
    <div className="animate-fade-in space-y-12 py-10">

      <section className="space-y-3">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All stories
        </Link>

        <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-600">
          Category
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 md:text-5xl">
          {name}
        </h1>

        <p className="text-lg font-light text-gray-500">
          {categoryBlogs.length} {categoryBlogs.length === 1 ? "story" : "stories"} in this category.
        </p>
      </section>

      <section>
        {categoryBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categoryBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                excerpt={blog.excerpt}
                slug={blog.slug}
                image={blog.image}
                category={{ name, slug }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-24">
            <div className="rounded-2xl border-2 border-dashed border-gray-200 px-16 py-12 text-center">
              <p className="text-lg font-semibold text-gray-400">No stories in this category yet.</p>
              <p className="mt-1 text-sm text-gray-400">Check back soon.</p>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
