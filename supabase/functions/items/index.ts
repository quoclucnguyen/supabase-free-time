// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import dayjs from "https://deno.land/x/deno_dayjs@v0.5.0/mod.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabase } from "../_shared/db.ts";
import { sendItemsToAllUsers } from "../_shared/send-to-all-users.ts";

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

      const { data } = await supabase.from("item").select("*")
        .eq("category", "foods")
        .gte(
          "expired_at",
          today.toISOString(),
        ).lte("expired_at", threeDaysLater.toISOString());

      await sendItemsToAllUsers(data ?? []);

      return Response.json(data);
    }

    case "POST": {
      return new Response("OK", { status: 200 });
    }

    default:
      return new Response("Method not allowed", { status: 405 });
  }
});
