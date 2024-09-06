import { pgTable, serial, text, timestamp, integer } from "npm:drizzle-orm@0.29.1/pg-core";

export const item = pgTable("item", {
  id: serial("id").primaryKey(),
  name: text("name"),
  location: text("location").$type<"dry" | "wet" | "refrigerator" | "freezer">(),
  status: text("status").$type<"out_date" | "ate">(),
  description: text("description"),
  note: text("note"),
  bucket: text("bucket"),
  path: text("path"),
  expired_at: timestamp("expired_at"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  created_at: timestamp("created_at"),
  first_name: text("first_name"),
  last_name: text("last_name"),
  username: text("username"),
  telegram_user_id: integer("telegram_user_id"),
});
