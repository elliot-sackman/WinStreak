drop policy "Enable delete for users based on user_id" on "public"."picks";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_picks(insert_data jsonb[], update_data jsonb[], delete_data integer[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
  record JSONB;
BEGIN
  -- Insert Data
  FOREACH record IN ARRAY insert_data
  LOOP
    INSERT INTO picks (contest_id, entry_id, user_id, pick_type, value, game_id, pick_status, pick_datetime)
    VALUES (
      (record->>'contest_id')::INT,
      (record->>'entry_id')::INT,
      (record->>'user_id')::UUID,
      record->>'pick_type',
      (record->>'value')::INT,
      (record->>'game_id')::INT,
      (record->>'pick_status')::picks_pick_status,
      NOW()
    );
  END LOOP;

  -- Update Data
  FOREACH record IN ARRAY update_data
  LOOP
    UPDATE picks
    SET value = (record->>'value')::INT,
        pick_datetime = NOW()
    WHERE pick_id = (record->>'pick_id')::INT;
  END LOOP;

  -- Delete Data
  FOREACH record IN ARRAY delete_data
  LOOP
    DELETE FROM picks
    WHERE pick_id = record::INT;
  END LOOP;

END;$function$
;

create policy "Enable delete for users based on user_id"
on "public"."picks"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



