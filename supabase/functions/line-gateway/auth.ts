import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { admin, username } from "better-auth/plugins"
import { user, account } from "./auth-schema.ts"

const connectionString = Deno.env.get("SUPABASE_DB_URL")!
const client = postgres(connectionString)
const db = drizzle({ 
    client
})
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { user, account },
    }),
    plugins: [admin(), username()]
})  