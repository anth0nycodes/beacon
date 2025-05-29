import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import fs from "fs";

if (fs.existsSync(".env.local")) {
  config({ path: ".env.local" });
} else {
  config({ path: ".env" }); // loads .env by default
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
