import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import fs from "fs";

// Prefer .env.local if it exists (for local dev), else fallback to .env
if (fs.existsSync(".env.local")) {
  config({ path: ".env.local" });
} else {
  config({ path: ".env" }); // loads .env by default
}

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
