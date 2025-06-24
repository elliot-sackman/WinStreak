create policy "Allow authenticated users to view completed picks"
on "public"."picks"
as permissive
for select
to authenticated
using (((pick_status = 'correct'::pick_status_type) OR (pick_status = 'incorrect'::pick_status_type)));



