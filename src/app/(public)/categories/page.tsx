import { db } from "@/lib/db";
import { blogs } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { safeQuery } from "@/lib/safe-query";
import Link from "next/link";

export const metadata = {
  title: "Categories — ModernBlog",
  description: "Browse all blog categories",
};

export default async function CategoriesPage() {
  const allCategories = await safeQuery(
    "categories:all",
    () =>
      db.query.categories.findMany({
        with: {
          blogs: {
            where: eq(blogs.published, true),
          },
        },
      }),
    []
  );

  return (
    <div className="animate-fade-in space-y-10 py-10">
      <section className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-950">
          Categories
        </h1>
        <p className="text-sm text-gray-500">Browse stories by topic.</p>
      </section>

      {allCategories.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                Category
              </div>
              <h2 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                {category.name}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {category.blogs.length}{" "}
                {category.blogs.length === 1 ? "story" : "stories"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-24">
          <div className="rounded-2xl border-2 border-dashed border-gray-200 px-16 py-12 text-center">
            <p className="text-lg font-semibold text-gray-400">
              No categories yet — check back soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
