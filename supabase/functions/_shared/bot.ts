import { Bot } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import "jsr:@std/dotenv/load";

/**
 * Bot instance
 */
const bot = new Bot(
    Deno.env.get("TELEGRAM_BOT_TOKEN") ||
      "",
  );

  export default bot;