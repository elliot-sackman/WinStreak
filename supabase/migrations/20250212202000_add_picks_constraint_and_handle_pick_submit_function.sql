CREATE UNIQUE INDEX unique_game_entry ON public.picks USING btree (game_id, entry_id);

alter table "public"."picks" add constraint "unique_game_entry" UNIQUE using index "unique_game_entry";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_picks(insert_data jsonb[], update_data jsonb[], delete_data integer[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  record JSONB;
BEGIN
  -- Insert Data
  FOREACH record IN ARRAY insert_data
  LOOP
    INSERT INTO picks (contest_id, entry_id, user_id, pick_type, value, game_id, pick_status, pick_datetime)
    VALUES (
      record->>'contest_id',
      record->>'entry_id',
      record->>'user_id',
      record->>'pick_type',
      record->>'value',
      record->>'game_id',
      record->>'pick_status',
      record->>'pick_datetime'::TIMESTAMP
    );
  END LOOP;

  -- Update Data
  FOREACH record IN ARRAY update_data
  LOOP
    UPDATE picks
    SET value = record->>'value',
        pick_datetime = record->>'pick_datetime'::TIMESTAMP
    WHERE pick_id = (record->>'pick_id')::INT;
  END LOOP;

  -- Delete Data
  FOREACH record IN ARRAY delete_data
  LOOP
    DELETE FROM picks
    WHERE pick_id = record;
  END LOOP;

END;
$function$
;


