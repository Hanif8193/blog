import { db } from "@/lib/db";
import { blogs } from "@/lib/schema";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { BlogCard } from "@/components/blog/BlogCard";
import { SearchInput } from "@/components/blog/SearchInput";
import { safeQuery } from "@/lib/safe-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const q = searchParams.q?.trim() ?? "";
  const pageSize = 9;
  const offset = (page - 1) * pageSize;

  const searchFilter = q
    ? or(ilike(blogs.title, `%${q}%`), ilike(blogs.excerpt, `%${q}%`))
    : undefined;

  const whereClause = and(eq(blogs.published, true), searchFilter);

  // Run both queries safely — a DB failure shows an empty state, not a crash
  const [allBlogs, totalCount] = await Promise.all([
    safeQuery(
      "blogs:list",
      () =>
        db.query.blogs.findMany({
          where: whereClause,
          limit: pageSize,
          offset,
          orderBy: [desc(blogs.createdAt)],
          with: { category: true },
        }),
      []
    ),
    safeQuery(
      "blogs:count",
      async () => {
        const [row] = await db
          .select({ totalCount: count() })
          .from(blogs)
          .where(whereClause);
        return row?.totalCount ?? 0;
      },
      0
    ),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="animate-fade-in space-y-10 py-10">

      {/* Header + Search */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-950">
            All Stories
          </h1>
          <p className="text-sm text-gray-500">
            {q
              ? `${totalCount} result${totalCount !== 1 ? "s" : ""} for "${q}"`
              : `${totalCount} ${totalCount === 1 ? "story" : "stories"} published`}
          </p>
        </div>

        <SearchInput defaultValue={q} />
      </section>

      {/* Grid */}
      <section className="space-y-10">
        {allBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {allBlogs.map((blog) => (
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

            {!q && totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                {page > 1 ? (
                  <Link href={`/blogs?page=${page - 1}`}>
                    <Button variant="secondary" size="md">← Previous</Button>
                  </Link>
                ) : (
                  <Button variant="secondary" size="md" disabled>← Previous</Button>
                )}

                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages ? (
                  <Link href={`/blogs?page=${page + 1}`}>
                    <Button variant="secondary" size="md">Next →</Button>
                  </Link>
                ) : (
                  <Button variant="secondary" size="md" disabled>Next →</Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-24">
            <div className="rounded-2xl border-2 border-dashed border-gray-200 px-16 py-12 text-center">
              {q ? (
                <>
                  <p className="text-lg font-semibold text-gray-400">
                    No results for &ldquo;{q}&rdquo;
                  </p>
                  <p className="mt-1 text-sm text-gray-400">Try a different keyword.</p>
                </>
              ) : (
                <p className="text-lg font-semibold text-gray-400">
                  No stories yet — check back soon.
                </p>
              )}
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
