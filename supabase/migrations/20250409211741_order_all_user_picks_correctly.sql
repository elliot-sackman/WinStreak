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
              'entry_id', ordered_entries.entry_id,
              'entry_number', ordered_entries.entry_number,
              'current_streak', ordered_entries.current_streak,
              'is_complete', ordered_entries.is_complete,
              'is_winner', ordered_entries.is_winner,
              'entry_picks', (
                SELECT jsonb_agg(to_jsonb(ordered_picks))
                FROM (SELECT * FROM picks p
                WHERE p.entry_id = ordered_entries.entry_id
                ORDER BY p.game_start_time ASC) AS ordered_picks
              )
            )
          )
          FROM (SELECT * FROM entries e
          WHERE e.user_id = uid AND e.contest_id = c.contest_id
          ORDER BY e.entry_number DESC) AS ordered_entries
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


