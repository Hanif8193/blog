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

export default function CategoryLoading() {
  return (
    <div className="animate-pulse space-y-12 py-10">
      <div className="space-y-3">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-5 w-24 rounded-full bg-gray-200" />
        <div className="h-10 w-56 rounded-xl bg-gray-200" />
        <div className="h-5 w-36 rounded bg-gray-100" />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
