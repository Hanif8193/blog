
import "dotenv/config";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users } from "../lib/schema";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(client);

async function main() {
  await db
    .update(users)
    .set({
      password: "$2b$10$5Y2ciKy2PF5tO7ZcZnGbtOUUd4gAdsJM3vTFCwk4bT1nAxMYMqMFG",
    })
    .where(eq(users.email, "admin@blog.com"));

  console.log("✅ Password fixed");

  await client.end();
}

main();