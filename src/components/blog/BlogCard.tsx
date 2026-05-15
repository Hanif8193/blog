import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  title: string;
  excerpt: string | null;
  slug: string;
  image: string | null;
  category?: { name: string; slug: string } | null;
  className?: string;
}

export function BlogCard({
  title,
  excerpt,
  slug,
  image,
  category,
  className,
}: BlogCardProps) {
  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {/* Image */}
      <Link href={`/blog/${slug}`} className="relative block h-52 shrink-0 overflow-hidden bg-gray-50">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-200">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Category badge — top-left of image */}
        {category && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm backdrop-blur-sm">
            {category.name}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <Link href={`/blog/${slug}`}>
          <h3 className="line-clamp-2 text-[1.05rem] font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
            {title}
          </h3>
        </Link>

        {excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">
            {excerpt}
          </p>
        )}

        <div className="mt-auto pt-5">
          <Link
            href={`/blog/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Read more
            <svg
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
