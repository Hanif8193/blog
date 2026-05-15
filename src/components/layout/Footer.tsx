import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">

          <Link href="/" className="text-lg font-bold tracking-tight text-gray-950">
            Modern<span className="text-blue-600">Blog</span>
          </Link>

          <nav className="flex gap-6 text-sm text-gray-500">
            <Link href="/" className="transition hover:text-gray-900">Home</Link>
            <Link href="/blogs" className="transition hover:text-gray-900">Blogs</Link>
          </nav>

          <p className="text-sm text-gray-400">© {currentYear} ModernBlog</p>
        </div>
      </div>
    </footer>
  );
}
