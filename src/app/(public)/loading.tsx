function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="h-52 w-full animate-pulse bg-gray-100" />
      <div className="space-y-3 p-6">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded-full bg-gray-100" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-gray-100" />
        <div className="pt-3">
          <div className="h-3 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-20 py-10">
      {/* Hero skeleton */}
      <div className="flex flex-col items-center space-y-5 py-10 text-center">
        <div className="h-5 w-36 animate-pulse rounded-full bg-gray-200" />
        <div className="h-12 w-2/3 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-6 w-1/2 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-10 w-36 animate-pulse rounded-full bg-gray-200" />
      </div>

      {/* Grid skeleton */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-7 w-40 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
