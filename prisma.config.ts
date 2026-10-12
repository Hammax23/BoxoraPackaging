import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node --project tsconfig.seed.json --transpile-only prisma/seed.ts",
  },
  datasource: {
    // Prisma CLI v7 loads this config for all commands (including `generate`).
    // Provide a safe local default so the repo can install/build without env setup,
    // while still using DATABASE_URL when provided.
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5436/boxora?schema=public",
  },
});

