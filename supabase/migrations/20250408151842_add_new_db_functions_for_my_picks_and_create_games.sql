set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_all_picks_data(uid uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN (
    SELECT jsonb_agg(
      jsonb_build_object(
        'contest_id', c.contest_id,
        'contest_name', c.contest_name,
        'user_entries', (
          SELECT jsonb_agg(
            jsonb_build_object(
              'entry_id', e.entry_id,
              'entry_number', e.entry_number,
              'current_streak', e.current_streak,
              'is_complete', e.is_complete,
              'is_winner', e.is_winner,
              'entry_picks', (
                SELECT jsonb_agg(to_jsonb(p))
                FROM picks p
                WHERE p.entry_id = e.entry_id
              )
            )
          )
          FROM entries e
          WHERE e.user_id = uid AND e.contest_id = c.contest_id
        )
      )
    )
    FROM contests c
    WHERE EXISTS (
      SELECT 1
      FROM entries e
      WHERE e.user_id = uid AND e.contest_id = c.contest_id
    )
  );
END;$function$
;

CREATE OR REPLACE FUNCTION public.get_user_pick_analytics(uid uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  total_correct_picks INT;
  total_completed_picks INT;
  correct_percentage NUMERIC;
  longest_streak INT;
BEGIN
  -- Calculate total number of correct picks
  SELECT COUNT(*) INTO total_correct_picks
  FROM picks p
  WHERE p.user_id = uid AND p.pick_status = 'correct';

  -- Calculate total number of completed picks
  SELECT COUNT(*) INTO total_completed_picks
  FROM picks p
  WHERE p.user_id = uid AND (p.pick_status = 'correct' OR p.pick_status = 'incorrect');

  -- Calculate the percentage of correct picks
  IF total_completed_picks > 0 THEN
    correct_percentage := (total_correct_picks::NUMERIC / total_completed_picks) * 100;
  ELSE
    correct_percentage := 0;
  END IF;

  -- Get the longest current streak
  SELECT MAX(current_streak) INTO longest_streak
  FROM entries e
  WHERE e.user_id = uid;

  -- Return the results as a JSON object
  RETURN jsonb_build_object(
    'total_correct_picks', total_correct_picks,
    'correct_percentage', correct_percentage,
    'longest_streak', longest_streak
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_game_operations(games_to_add jsonb[], potential_games_to_update jsonb[], game_ids_to_delete jsonb[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
  game JSONB;
BEGIN
  -- Insert new games
  FOREACH game IN ARRAY games_to_add
  LOOP
    INSERT INTO games (league_id, start_time, home_team_id, away_team_id, status, game_api_id) 
    VALUES (
      (game->>'league_id')::INT,
      (game->>'start_time')::TIMESTAMPTZ,
      (game->>'home_team_id')::INT,
      (game->>'away_team_id')::INT,
      (game->>'status')::game_status,
      (game->>'game_api_id')::INT
    );
  END LOOP;

  -- Update game start times and related picks
  FOREACH game IN ARRAY potential_games_to_update
  LOOP
    UPDATE games
    SET start_time = (game->>'start_time')::TIMESTAMPTZ
    WHERE game_id = (game->>'game_id')::INT;

    UPDATE picks
    SET game_start_time = (game->>'start_time')::TIMESTAMPTZ
    WHERE game_id = (game->>'game_id')::INT;
  END LOOP;

  -- Delete picks and games
  FOREACH game IN ARRAY game_ids_to_delete
  LOOP
    DELETE FROM picks
    WHERE game_id = (game->>'game_id')::INT;

    DELETE FROM games
    WHERE game_id = (game->>'game_id')::INT;
  END LOOP;

  RETURN;
END;$function$
;


