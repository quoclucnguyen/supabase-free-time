import dayjs from "https://deno.land/x/deno_dayjs@v0.5.0/mod.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import bot from "./bot.ts";
import db from "./db.ts";
import { user } from "./schema.ts";

const supabaseAdminClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

/**
 * Creates a markdown string with the item's information
 * @param {{ name: string, location: string, expiredAt: Date, description: string, note: string }} item
 * @returns {string}
 */
const createItemContent = ({ name, location, expired_at, description, note }: {
  name: string | null;
  location: string | null;
  expired_at: Date | null;
  description: string | null;
  note: string | null;
}): string => {
  let expiredText = "";
  const diffTimeDays = dayjs(expired_at).diff(dayjs(), "day");

  if (diffTimeDays == 0) {
    const diffHours = dayjs(expired_at).diff(dayjs(), "hours");
    expiredText = `*Expired at:* ${
      dayjs(expired_at).format("DD/MM/YYYY")
    } ${diffHours} hours`;
  } else if (diffTimeDays > 0) {
    expiredText = `*Expired at:* ${
      dayjs(expired_at).format("DD/MM/YYYY")
    } ${diffTimeDays} days`;
  } else {
    expiredText = `*Expired at:* ${
      dayjs(expired_at).format("DD/MM/YYYY")
    } *(out of date)*`;
  }

  return `\
*Name:* ${name}
*Location:* _${location}_
${expiredText}
*Description:* ${description}
*Note:* ${note}
  `;
};

/**
 * Sends all items to all users
 *
 * @returns {Promise<void>}
 */
export const sendItemsToAllUsers = async (items: any): Promise<void> => {
  const users = await db.select().from(user);

  for (const user of users) {
    for (const item of items) {
      if (item.bucket && item.path) {
        const result = await supabaseAdminClient.storage.from(
          "items",
        )
          .createSignedUrl(item.path, 60 * 60 * 24 * 7);

        if (result.data) {
          await bot.api.sendPhoto(
            user.telegram_user_id ?? "",
            result.data.signedUrl,
            {
              caption: createItemContent(item),
              parse_mode: "Markdown",
            },
          );
        }
      } else {
        await bot.api.sendMessage(
          user.telegram_user_id ?? "",
          createItemContent(item),
          {
            parse_mode: "Markdown",
          },
        );
      }
    }
  }
};
