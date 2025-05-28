set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_picks_start_time_on_game_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE picks
  SET game_start_time = NEW.start_time
  WHERE game_id = NEW.game_id;
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER trigger_update_picks_start_time_on_game_start_change AFTER UPDATE OF start_time ON public.games FOR EACH ROW WHEN ((old.start_time IS DISTINCT FROM new.start_time)) EXECUTE FUNCTION update_picks_start_time_on_game_update();


