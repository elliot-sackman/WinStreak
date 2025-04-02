create type "public"."contest_status_type" as enum ('scheduled', 'in_progress', 'ended');

create type "public"."pick_status_type" as enum ('pending', 'correct', 'incorrect');

drop trigger if exists "trigger_auto_fill_contest_winner_display_name" on "public"."contests";

alter table "public"."contests" drop constraint "contests_contest_winner_user_id_fkey";

drop function if exists "public"."auto_fill_contest_winner_display_name"();

alter table "public"."contests" drop column "contest_winner_display_name";

alter table "public"."contests" drop column "contest_winner_user_id";

alter table "public"."contests" add column "contest_winning_entry_ids_array" integer[];

alter table "public"."contests" alter column "contest_status" drop default;

alter table "public"."contests" alter column "contest_status" set data type contest_status_type using "contest_status"::text::contest_status_type;

alter table "public"."contests" alter column "contest_status" set default 'scheduled'::contest_status_type;

alter table "public"."entries" add column "is_winner" boolean;

alter table "public"."picks" alter column "pick_status" drop default;

alter table "public"."picks" alter column "pick_status" set data type pick_status_type using "pick_status"::text::pick_status_type;

alter table "public"."picks" alter column "pick_status" set default 'pending'::pick_status_type;

drop type "public"."contest_status";

drop type "public"."picks_pick_status";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_potential_winning_entries()
 RETURNS TABLE(entry_id integer, contest_id integer, user_id uuid, display_name text, current_streak integer, contest_streak_length integer)
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN QUERY
  SELECT
    e.entry_id,
    e.contest_id,
    e.user_id,
    e.display_name,
    e.current_streak,
    e.contest_streak_length
  FROM entries e
  WHERE e.is_complete = FALSE
    AND e.current_streak = e.contest_streak_length;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_contests_and_entries(updatecontests jsonb[], updateentries jsonb[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
  record JSONB;
BEGIN
  -- Update games table
  FOREACH record IN ARRAY updateContests
  LOOP
    UPDATE contests
    SET 
      contest_winning_entry_ids_array = 
        (SELECT ARRAY(
          SELECT jsonb_array_elements_text(record->'contest_winning_entry_ids_array')::INT
        )),
      contest_status = (record->>'contest_status')::contest_status_type,
      contest_end_datetime = (record ->> 'contest_end_datetime')::TIMESTAMPTZ
    WHERE contest_id = (record->>'contest_id')::INT;
  END LOOP;

  -- Update entries table
  FOREACH record IN ARRAY updateEntries
  LOOP
    UPDATE entries
    SET 
      current_streak = (record->>'current_streak')::INT,
      is_complete = (record->>'is_complete')::BOOLEAN,
      is_winner = (record->>'is_winner')::BOOLEAN,
      entry_completion_datetime = 
        CASE 
          WHEN record->>'entry_completion_datetime' IS NOT NULL 
          THEN (record->>'entry_completion_datetime')::TIMESTAMPTZ 
          ELSE entry_completion_datetime 
        END
    WHERE entry_id = (record->>'entry_id')::INT;
  END LOOP;

END;$function$
;

CREATE OR REPLACE FUNCTION public.update_games_picks_entries(updategames jsonb[], updatepicks jsonb[], updateentries jsonb[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
  record JSONB;
BEGIN
  -- Update games table
  FOREACH record IN ARRAY updateGames
  LOOP
    UPDATE games
    SET 
      home_team_win = (record->>'home_team_win')::BOOLEAN,
      away_team_win = (record->>'away_team_win')::BOOLEAN,
      status = (record->>'status')::game_status
    WHERE game_id = (record->>'game_id')::INT;
  END LOOP;

  -- Update picks table
  FOREACH record IN ARRAY updatePicks
  LOOP
    UPDATE picks
    SET 
      home_team_win = (record->>'home_team_win')::BOOLEAN,
      away_team_win = (record->>'away_team_win')::BOOLEAN,
      pick_status = (record->>'pick_status')::pick_status_type,
      pick_resolution_datetime = (record->>'pick_resolution_datetime')::TIMESTAMPTZ
    WHERE pick_id = (record->>'pick_id')::INT;
  END LOOP;

  -- Update entries table
  FOREACH record IN ARRAY updateEntries
  LOOP
    UPDATE entries
    SET 
      current_streak = (record->>'current_streak')::INT,
      is_complete = (record->>'is_complete')::BOOLEAN,
      first_incorrect_pick_id = 
        CASE 
          WHEN record->>'first_incorrect_pick_id' IS NOT NULL
          THEN (record->>'first_incorrect_pick_id')::INT 
          ELSE first_incorrect_pick_id 
        END,
      entry_completion_datetime = 
        CASE 
          WHEN record->>'entry_completion_datetime' IS NOT NULL
          THEN (record->>'entry_completion_datetime')::TIMESTAMPTZ 
          ELSE entry_completion_datetime 
        END,
      first_incorrect_pick_losing_team_full_name =
        CASE 
          WHEN record->>'first_incorrect_pick_losing_team_full_name' IS NOT NULL
          THEN (record->>'first_incorrect_pick_losing_team_full_name')
          ELSE first_incorrect_pick_losing_team_full_name 
        END,
      first_incorrect_pick_losing_team_id =
        CASE 
          WHEN record->>'first_incorrect_pick_losing_team_id' IS NOT NULL
          THEN (record->>'first_incorrect_pick_losing_team_id')::INT
          ELSE first_incorrect_pick_losing_team_id 
        END
    WHERE entry_id = (record->>'entry_id')::INT;
  END LOOP;

END;$function$
;


