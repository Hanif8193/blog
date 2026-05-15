const REQUIRED = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"] as const;

/**
 * Called once at module load in db.ts.
 * In production: throws immediately so the deployment fails fast with a clear message.
 * In development: logs warnings so the dev server still starts for partial setup.
 */
export function validateEnv(): void {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length === 0) return;

  const lines = [
    "❌  Missing required environment variables:",
    ...missing.map((k) => `     - ${k}`),
    "",
    "Set them in .env.local (dev) or your deployment dashboard (prod).",
  ];

  console.error(lines.join("\n"));

  if (process.env.NODE_ENV === "production") {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}
