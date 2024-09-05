create type "public"."item_status_enum" as enum ('out_date', 'ate');

alter table "public"."item" add column "expired_at" timestamp with time zone;

alter table "public"."item" add column "status" item_status_enum;

create policy "All"
on "public"."item"
as permissive
for all
to anon
using (true);



