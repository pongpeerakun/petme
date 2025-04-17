import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env" })

export default defineConfig({
    schema: [
        "./drizzle/schema.ts",
        "./drizzle/table.ts", 
        "./auth-schema.ts"],
    out: "./supabase/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
})