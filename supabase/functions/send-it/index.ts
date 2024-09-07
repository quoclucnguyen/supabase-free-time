// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import  { sendItemsToAllUsers } from "../_shared/send-to-all-users.ts";

Deno.serve(async (_req) => {
  
  await sendItemsToAllUsers([]);
  const data = {
    message: `Hello !`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

