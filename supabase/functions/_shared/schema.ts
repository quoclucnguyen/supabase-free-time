import { pgTable, serial, text, timestamp } from "npm:drizzle-orm@0.29.1/pg-core";

export const item = pgTable("item", {
  id: serial("id").primaryKey(),
  name: text("name"),
  location: text("location").$type<"dry" | "wet" | "refrigerator" | "freezer">(),
  imageUrl: text("image_url"),
  decription: text("decription"),
  note: text("note"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
