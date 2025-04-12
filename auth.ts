import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { drizzle } from "drizzle-orm/postgres-js"
import { config } from "dotenv"
import postgres from "postgres"
import { admin, username } from "better-auth/plugins"


config({ path: ".env" })
const client = postgres(process.env.DATABASE_URL!)
const db = drizzle({ client })
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    plugins: [admin(), username()]
})