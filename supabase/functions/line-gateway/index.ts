import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { lineMessagesTable } from "./schema.ts"

Deno.serve(async (req) => {
  const content = await req.json()
  const envName = Deno.env.get("ENV") === "production" ? "DATABASE_URL" : "SUPABASE_DB_URL"
  const connectionString = Deno.env.get(envName)!


  const client = postgres(connectionString, { prepare: false });
  const db = drizzle({ client })
  console.log("line message event received", content)
  await db.insert(lineMessagesTable).values({
    content
  })
  console.log("line message event inserted")

  return new Response(
    JSON.stringify({}),
    { headers: { "Content-Type": "application/json" } },
  )
})