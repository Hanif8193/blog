import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
  max: 1,
});

const db = drizzle(client);

async function main() {
  console.log("🚀 Running database migrations...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("✅ All migrations applied successfully.");
}

main()
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  })
  .finally(() => client.end());
