"use client";

import { useEffect } from "react";

// Catches errors thrown by the root layout itself.
// Requires its own <html>/<body> because the layout is unavailable.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            textAlign: "center",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#6b7280" }}>A critical error occurred. Please try again.</p>
          {error.digest && (
            <code style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
              ID: {error.digest}
            </code>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: "1rem",
              borderRadius: "9999px",
              background: "#2563eb",
              color: "#fff",
              padding: "0.6rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
