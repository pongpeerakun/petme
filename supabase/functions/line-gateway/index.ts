import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { DbClient } from "./drizzle/query/db.ts"
import { Payload } from "./drizzle/query/type.ts"


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-line-signature',
}

Deno.serve(async (req) => {
  try {
    const envName = Deno.env.get("ENV") === "production" ? "DATABASE_URL" : "SUPABASE_DB_URL"
    const connectionString = Deno.env.get(envName)!

    const db = new DbClient(connectionString)
    const reqBody = await req.json()
    const event = Payload.parse(reqBody)
    await db.saveLineEvents(event)
    return new Response(
      JSON.stringify({}),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})