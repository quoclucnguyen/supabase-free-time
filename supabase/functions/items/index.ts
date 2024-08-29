// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { drizzle } from "npm:drizzle-orm@0.29.1/postgres-js";
import postgres from "npm:postgres@3.4.3";
import { item } from "../_shared/schema.ts";
import {  count, desc } from "npm:drizzle-orm@0.29.1";

console.log("Items function");

// Get the connection string from the environment variable "SUPABASE_DB_URL"
const databaseUrl = Deno.env.get("SUPABASE_DB_URL")!;

Deno.serve(async (req) => {
  const { method } = req;

  // This is needed if you're planning to invoke your function from a browser.
  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(databaseUrl, { prepare: false });
  const db = drizzle(client, {
    schema: {
      item,
    },
  });
  // const allItems = await db.query.item.findMany();

  switch (method) {
    case "GET": {
      const rows = await db.query.item.findMany({
        offset: 0,
        limit: 10,
        orderBy: desc(item.id),
      });
      const result = await db.select({ count: count() }).from(item);

      return Response.json({ rows, count: result[0].count });
    }

    case "POST": {
      await db.insert(item).values({
        name: "test",
        location: "dry",
        imageUrl: "test",
        decription: "test",
        note: "test",
      });

      return new Response("OK", { status: 200 });
    }

    default:
      return new Response("Method not allowed", { status: 405 });
  }
});
