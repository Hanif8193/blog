export default function BlogLoading() {
  return (
    <div className="animate-pulse space-y-10 py-10">
      {/* Header */}
      <div className="mx-auto max-w-3xl space-y-4 px-4 pt-10 sm:px-6">
        <div className="h-5 w-24 rounded-full bg-gray-200" />
        <div className="h-10 w-4/5 rounded-xl bg-gray-200" />
        <div className="h-6 w-2/3 rounded-lg bg-gray-100" />
        <div className="flex items-center gap-3 border-t border-gray-100 pt-6">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-3 w-3 rounded-full bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-3 w-3 rounded-full bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
        </div>
      </div>

      {/* Hero image */}
      <div className="full-bleed h-[70vh] min-h-[480px] bg-gray-100" />

      {/* Article body */}
      <div className="mx-auto max-w-3xl space-y-4 px-4 pb-24 sm:px-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-gray-100"
            style={{ width: i % 5 === 4 ? "60%" : i % 3 === 2 ? "85%" : "100%" }}
          />
        ))}
      </div>
    </div>
  );
}
