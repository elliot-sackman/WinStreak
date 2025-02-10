alter table "public"."entries" enable row level security;

create policy "Enable insert for users based on user_id"
on "public"."entries"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."entries"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



