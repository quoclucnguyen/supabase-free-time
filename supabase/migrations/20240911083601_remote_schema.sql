create policy "all"
on "public"."user"
as permissive
for all
to anon
using (true)
with check (true);



