set check_function_bodies = off;

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
      pick_status = (record->>'pick_status')::picks_pick_status,
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
      first_incorrect_pick_team_id =
        CASE 
          WHEN record->>'first_incorrect_pick_team_id' IS NOT NULL
          THEN (record->>'first_incorrect_pick_team_id')::INT
          ELSE first_incorrect_pick_team_id 
        END
    WHERE entry_id = (record->>'entry_id')::INT;
  END LOOP;

END;$function$
;


