create type "public"."item_category_enum" as enum ('foods', 'cosmetics', 'others');

drop policy "all" on "public"."user";

alter table "public"."item" add column "category" item_category_enum default 'others'::item_category_enum;


