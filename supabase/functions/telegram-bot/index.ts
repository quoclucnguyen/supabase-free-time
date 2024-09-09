import { webhookCallback } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import "jsr:@std/dotenv/load";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import bot from "../_shared/bot.ts";
import { supabase } from "../_shared/db.ts";

const insertUser = async (
  { first_name, last_name, username, id }: {
    first_name: string;
    last_name?: string;
    username?: string;
    id: number;
  },
) => {
  await supabase.from("user").insert({
    first_name,
    last_name,
    username,
    telegram_user_id: id,
  });
};

const findUserById = async (id: number) => {
  return await supabase.from("user").select("*").eq("telegram_user_id", id);
};

bot.command("start", async (ctx) => {
  if (ctx?.message?.from) {
    const users = await findUserById(ctx.message.from.id);

    if (users?.data?.length ?? 0 > 0) {
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
