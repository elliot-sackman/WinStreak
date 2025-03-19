alter table "public"."sponsors" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_games_picks_entries(updategames jsonb[], updatepicks jsonb[], updateentries jsonb[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
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
      pick_status = (record->>'pick_status')::picks_pick_status
    WHERE pick_id = (record->>'pick_id')::INT;
  END LOOP;

  -- Update entries table
  FOREACH record IN ARRAY updateEntries
  LOOP
    UPDATE entries
    SET 
      current_streak = (record->>'current_streak')::INT,
      is_complete = (record->>'is_complete')::BOOLEAN
    WHERE entry_id = (record->>'entry_id')::INT;
  END LOOP;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_picks_on_game_score_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update the home_team_score and away_team_score in picks
  UPDATE picks
  SET 
    home_team_score = NEW.home_team_score,
    away_team_score = NEW.away_team_score
  WHERE game_id = NEW.game_id;

  RETURN NEW;
END;
$function$
;

create policy "Enable read access for all users"
on "public"."sponsors"
as permissive
for select
to public
using (true);


CREATE TRIGGER trigger_update_picks_on_game_score_change AFTER UPDATE OF home_team_score, away_team_score ON public.games FOR EACH ROW WHEN (((old.home_team_score IS DISTINCT FROM new.home_team_score) OR (old.away_team_score IS DISTINCT FROM new.away_team_score))) EXECUTE FUNCTION update_picks_on_game_score_change();


