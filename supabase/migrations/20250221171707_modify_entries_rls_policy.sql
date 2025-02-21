drop policy "Enable users to view their own data only" on "public"."entries";

create policy "Enable read access for all users"
on "public"."entries"
as permissive
for select
to authenticated
using (true);



