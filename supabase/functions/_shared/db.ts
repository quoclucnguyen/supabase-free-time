import { drizzle } from "npm:drizzle-orm@0.29.1/postgres-js/driver";
import { item, user } from "./schema.ts";
import postgres from "npm:postgres@3.4.3";

const databaseUrl = Deno.env.get("SUPABASE_DB_URL")!;
const client = postgres(databaseUrl, { prepare: false });
 const db = drizzle(client, {
  schema: {
    user,
    item,
  },
});

export default db;