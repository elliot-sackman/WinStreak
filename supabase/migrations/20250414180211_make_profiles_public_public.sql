drop policy "Enable read access for all users" on "public"."profiles_public";

create policy "Enable read access for all users"
on "public"."profiles_public"
as permissive
for select
to public
using (true);



