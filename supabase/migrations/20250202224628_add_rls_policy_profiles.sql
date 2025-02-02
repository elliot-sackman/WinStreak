create policy "Allow users to read their own profile"
on "public"."profiles"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = id));



