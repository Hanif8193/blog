function StatSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-gray-200" />
        <div className="h-4 w-64 rounded bg-gray-100" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <div className="space-y-3">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-3/4 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
