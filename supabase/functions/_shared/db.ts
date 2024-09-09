import { createClient } from "jsr:@supabase/supabase-js@2";
import { drizzle } from "npm:drizzle-orm@0.29.1/postgres-js/driver";
import postgres from "npm:postgres@3.4.3";
import { item, user } from "./schema.ts";

const databaseUrl = Deno.env.get("SUPABASE_DB_URL")!;
const client = postgres(databaseUrl, { prepare: false });
const db = drizzle(client, {
  schema: {
    user,
    item,
  },
});

export const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
);

export default db;
