// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

console.log(`Function "telegram-bot" up and running!`);

import postgres from "npm:postgres@3.4.3";
import { Bot, webhookCallback } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { drizzle } from "npm:drizzle-orm@0.29.1/postgres-js/driver";
import { user } from "../_shared/schema.ts";
import { eq } from "npm:drizzle-orm@0.29.1/expressions";

const databaseUrl = Deno.env.get("SUPABASE_DB_URL")!;
const client = postgres(databaseUrl, { prepare: false });
const db = drizzle(client, {
  schema: {
    user,
  },
});

const insertUser = async (
  { first_name, last_name, username, id }: {
    first_name: string;
    last_name?: string;
    username?: string;
    id: number;
  },
) => {
  await db.insert(user).values({
    first_name,
    last_name,
    username,
    telegram_user_id: id,
  });
};

const findUserById = async (id: number) => {
  return await db.select().from(user).where(eq(user.telegram_user_id, id))
    .limit(1);
};

/**
 * Bot instance
 */
const bot = new Bot(
  Deno.env.get("TELEGRAM_BOT_TOKEN") ||
    "5255532380:AAFYA3U2gX3-KVCrc3vG6S5mRrWGFjTJQ4c",
);

bot.command("start", async (ctx) => {
  if (ctx?.message?.from) {
    const users = await findUserById(ctx.message.from.id);
    if (users.length > 0) {
      ctx.reply("Welcome back!");
      ctx.reply("👋");
      return;
    } else {
      await insertUser(ctx.message.from);
    }
  }
  ctx.reply("Welcome! Up and running.");
});

bot.command("ping", (ctx) => ctx.reply(`Pong! ${new Date()} ${Date.now()}`));

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
  try {
    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
  }
});
