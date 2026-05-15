"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AdminError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900">Page error</h2>
        <p className="text-sm text-gray-500">
          Something went wrong loading this admin page.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400">Error ID: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
