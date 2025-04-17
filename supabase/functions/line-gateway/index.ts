import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-line-signature',
}

Deno.serve(async (req) => {
  try {
    const { destination, events } = await req.json()
    const envName = Deno.env.get("ENV") === "production" ? "DATABASE_URL" : "SUPABASE_DB_URL"
    const connectionString = Deno.env.get(envName)!
    const client = postgres(connectionString, { prepare: false });
    const db = drizzle({ client })


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