create policy "Enable insert for anon"
on "storage"."objects"
as permissive
for insert
to public
with check (true);


create policy "Enable read access for anon"
on "storage"."objects"
as permissive
for select
to anon
using (true);



