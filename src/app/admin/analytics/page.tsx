import { db } from "@/lib/db";
import { blogs, likes } from "@/lib/schema";
import { count, desc, eq, sum } from "drizzle-orm";
import { StatCard } from "@/components/admin/StatCard";
import Link from "next/link";
import { Eye, Heart, TrendingUp, FileText } from "lucide-react";

export default async function AnalyticsPage() {
  // Each query is individually guarded so a missing table (likes, before migration)
  // shows zeros instead of crashing the page.
  let views = 0;
  let likesTotal = 0;
  let posts = 0;
  let topViewed: { id: string; title: string; slug: string; views: number }[] = [];
  let topLiked: { title: string; slug: string; likeCount: number }[] = [];

  try {
    const [viewsRow] = await db.select({ total: sum(blogs.views) }).from(blogs);
    views = Number(viewsRow?.total) || 0;
  } catch (err) {
    console.error("[Analytics:views]", err instanceof Error ? err.message : err);
  }

  try {
    const [likesRow] = await db.select({ total: count() }).from(likes);
    likesTotal = Number(likesRow?.total) || 0;
  } catch (err) {
    console.error("[Analytics:likes]", err instanceof Error ? err.message : err);
  }

  try {
    const [postsRow] = await db
      .select({ total: count() })
      .from(blogs)
      .where(eq(blogs.published, true));
    posts = Number(postsRow?.total) || 0;
  } catch (err) {
    console.error("[Analytics:posts]", err instanceof Error ? err.message : err);
  }

  try {
    topViewed = await db
      .select({ id: blogs.id, title: blogs.title, slug: blogs.slug, views: blogs.views })
      .from(blogs)
      .where(eq(blogs.published, true))
      .orderBy(desc(blogs.views))
      .limit(5);
  } catch (err) {
    console.error("[Analytics:topViewed]", err instanceof Error ? err.message : err);
  }

  try {
    const rows = await db
      .select({
        title: blogs.title,
        slug: blogs.slug,
        likeCount: count(likes.id),
      })
      .from(likes)
      .innerJoin(blogs, eq(likes.blogId, blogs.id))
      .groupBy(blogs.id, blogs.title, blogs.slug)
      .orderBy(desc(count(likes.id)))
      .limit(5);

    topLiked = rows.map((r) => ({ ...r, likeCount: Number(r.likeCount) }));
  } catch (err) {
    console.error("[Analytics:topLiked]", err instanceof Error ? err.message : err);
  }

  const avgViews = posts > 0 ? Math.round(views / posts) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Engagement overview across all published posts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Views"
          value={views.toLocaleString()}
          description="All-time page views"
          icon={<Eye className="h-6 w-6" />}
        />
        <StatCard
          title="Total Likes"
          value={likesTotal.toLocaleString()}
          description="Across all posts"
          icon={<Heart className="h-6 w-6" />}
        />
        <StatCard
          title="Published Posts"
          value={posts}
          description="Live on the site"
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard
          title="Avg Views / Post"
          value={avgViews.toLocaleString()}
          description="Mean views per published post"
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataTable
          title="Top 5 — Most Viewed"
          rows={topViewed.map((p) => ({ label: p.title, slug: p.slug, value: p.views.toLocaleString() }))}
          emptyText="No view data yet."
        />
        <DataTable
          title="Top 5 — Most Liked"
          rows={topLiked.map((p) => ({ label: p.title, slug: p.slug, value: p.likeCount.toLocaleString() }))}
          emptyText="No likes recorded yet."
        />
      </div>
    </div>
  );
}

function DataTable({
  title,
  rows,
  emptyText,
}: {
  title: string;
  rows: { label: string; slug: string; value: string }[];
  emptyText: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400">{emptyText}</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              <th className="pb-3">Post</th>
              <th className="pb-3 text-right">Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.slug}>
                <td className="py-3 pr-4">
                  <Link
                    href={`/blog/${row.slug}`}
                    target="_blank"
                    className="line-clamp-1 font-medium text-gray-800 hover:text-blue-600"
                  >
                    {row.label}
                  </Link>
                </td>
                <td className="py-3 text-right font-semibold text-gray-700">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
