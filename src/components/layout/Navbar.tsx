import Link from "next/link"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Modern<span className="text-blue-600">Blog</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/blogs"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Blogs
              </Link>
              <Link
                href="/categories"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Categories
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
