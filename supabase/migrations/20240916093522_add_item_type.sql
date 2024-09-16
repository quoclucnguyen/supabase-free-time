create type "public"."item_type_enum" as enum ('vegetable_fruit', 'fresh_meat');

alter table "public"."item" add column "type" item_type_enum;


