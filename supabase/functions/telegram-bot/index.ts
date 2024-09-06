import "jsr:@std/dotenv/load";
import { webhookCallback } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { user } from "../_shared/schema.ts";
import { eq } from "npm:drizzle-orm@0.29.1/expressions";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import db from "../_shared/db.ts";
import bot from "../_shared/bot.ts";

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
