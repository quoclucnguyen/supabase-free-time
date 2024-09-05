alter table "public"."item" drop column "decription";

alter table "public"."item" drop column "image_url";

alter table "public"."item" add column "bucket" text;

alter table "public"."item" add column "description" text;

alter table "public"."item" add column "path" text;

alter table "public"."item" enable row level security;


