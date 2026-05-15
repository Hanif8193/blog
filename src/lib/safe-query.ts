/**
 * Wraps any async DB call so a database failure never crashes a page.
 * Returns `fallback` and logs the error instead of throwing.
 */
export async function safeQuery<T>(
  label: string,
  queryFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await queryFn();
  } catch (err) {
    console.error(
      `[DB:${label}]`,
      err instanceof Error ? err.message : String(err)
    );
    return fallback;
  }
}
