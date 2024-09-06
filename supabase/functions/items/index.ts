// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { item } from "../_shared/schema.ts";
import {  and, count, desc, gte, lte } from "npm:drizzle-orm@0.29.1";
import db from "../_shared/db.ts";
import dayjs from "https://deno.land/x/deno_dayjs@v0.5.0/mod.ts";
import sendToAllUsers from "../_shared/send-to-all-users.ts";

Deno.serve(async (req) => {
  const { method } = req;

  // This is needed if you're planning to invoke your function from a browser.
  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

 

  switch (method) {
    case "GET": {
      const today = dayjs().toDate();
      const threeDaysLater = dayjs().add(3, "day").toDate();
      const entities = await db.select().from(item).where(and(gte(item.expired_at,today), lte(item.expired_at,threeDaysLater))).orderBy(desc(item.expired_at));
      
      for (const entity of entities) {
        await sendToAllUsers(`Expired item: ${entity.name} in ${entity.location} expired at ${dayjs(entity.expired_at).format("DD/MM/YYYY")}`);
      }
      return Response.json(entities);
    }

    case "POST": {
      await db.insert(item).values({
        name: "test",
        location: "dry",
        description: "test",
        note: "test",
      });

      return new Response("OK", { status: 200 });
    }

    default:
      return new Response("Method not allowed", { status: 405 });
  }
});


