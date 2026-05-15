import { db } from "@/lib/db";
import { blogs, likes } from "@/lib/schema";
import { and, count, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { safeQuery } from "@/lib/safe-query";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ViewTracker } from "@/components/blog/ViewTracker";
import { LikeButton } from "@/components/blog/LikeButton";

export default async function SingleBlogPage({
  params,
}: {
  params: { slug: string };
}) {
  // Primary blog fetch — let notFound() handle missing slugs naturally
  const blog = await safeQuery(
    "blog:single",
    () =>
      db.query.blogs.findFirst({
        where: eq(blogs.slug, params.slug),
        with: { category: true, author: true },
      }),
    null
  );

  if (!blog) notFound();

  // ── Like state — isolated try/catch so a missing likes table
  //   (migration pending) never crashes the blog detail page ─────────────────
  let likeCount = 0;
  let isLiked = false;

  try {
    const cookieStore = cookies();
    const fingerprint = cookieStore.get("fp")?.value ?? null;

    const [likeRow] = await db
      .select({ likeCount: count() })
      .from(likes)
      .where(eq(likes.blogId, blog.id));

    likeCount = Number(likeRow?.likeCount ?? 0);

    if (fingerprint) {
      const existingLike = await db.query.likes.findFirst({
        where: and(
          eq(likes.blogId, blog.id),
          eq(likes.fingerprint, fingerprint)
        ),
      });
      isLiked = !!existingLike;
    }
  } catch (err) {
    // Likes system unavailable — page still renders without like state
    console.error("[blog:likes]", err instanceof Error ? err.message : err);
  }

  // ── Meta ─────────────────────────────────────────────────────────────────
  const formattedDate = blog.createdAt
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(blog.createdAt)
    : "";

  const readingTime = Math.max(
    1,
    Math.ceil((blog.content ?? "").split(/\s+/).length / 200)
  );

  const views = blog.views ?? 0;

  return (
    <>
      <ReadingProgress />
      <ViewTracker blogId={blog.id} />

      <div className="animate-fade-in space-y-10">

        {/* ── 1. HEADER ── */}
        <header className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
          {blog.category && (
            <Link
              href={`/category/${blog.category.slug}`}
              className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-600 transition hover:bg-blue-100"
            >
              {blog.category.name}
            </Link>
          )}

          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-5 text-xl font-light leading-relaxed text-gray-500">
              {blog.excerpt}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-6 text-sm">
            {blog.author?.name && (
              <span className="font-semibold text-gray-800">{blog.author.name}</span>
            )}
            {formattedDate && (
              <>
                <span className="text-gray-300">·</span>
                <time dateTime={blog.createdAt?.toISOString()} className="text-gray-500">
                  {formattedDate}
                </time>
              </>
            )}
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">{readingTime} min read</span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1 text-gray-500">
              <Eye className="h-3.5 w-3.5" />
              {views.toLocaleString()} views
            </span>
          </div>
        </header>

        {/* ── 2. CINEMATIC HERO IMAGE ── */}
        {blog.image && (
          <div className="full-bleed relative h-[70vh] min-h-[480px] overflow-hidden">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center animate-hero-zoom"
            />
          </div>
        )}

        {/* ── 3. ARTICLE BODY ── */}
        <article className="mx-auto max-w-3xl px-4 pb-24 pt-2 sm:px-6">
          <div className="space-y-7">
            {(blog.content ?? "").split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-[1.075rem] leading-[1.85] text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-8">
            <LikeButton
              blogId={blog.id}
              initialLiked={isLiked}
              initialCount={likeCount}
            />

            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to all stories
            </Link>
          </div>
        </article>

      </div>
    </>
  );
}
