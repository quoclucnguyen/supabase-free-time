import bot from "./bot.ts";
import db from "./db.ts";
import { user } from "./schema.ts";

const sendToAllUsers = async (message: string) =>{
    const result = await db.select().from(user);

  for (const user of result) {
    await bot.api.sendMessage(user.telegram_user_id ?? '',message);
  }
}

export default sendToAllUsers;