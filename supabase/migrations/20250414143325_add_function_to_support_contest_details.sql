set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_all_picks_data_by_contest(uid uuid, cid integer)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'contest_details', to_jsonb(c),
      'user_entries', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'entry_details', to_jsonb(ordered_entries),
            'entry_picks', (
              SELECT jsonb_agg(to_jsonb(ordered_picks))
              FROM (SELECT * FROM picks p
              WHERE p.entry_id = ordered_entries.entry_id
              ORDER BY p.game_start_time ASC) AS ordered_picks
            )
          )
        )
        FROM (SELECT * FROM entries e
        WHERE e.user_id = uid AND e.contest_id = cid
        ORDER BY e.entry_number DESC) AS ordered_entries
      ),
      'leaderboard_entries', (
        SELECT jsonb_agg(
          to_jsonb(ordered_leaderboard_entries)
        )
        FROM (
          SELECT * FROM entries le
          WHERE le.is_complete = (c.contest_status = 'ended') AND le.contest_id = cid AND le.first_incorrect_pick_id IS NULL
          ORDER by le.current_streak DESC, le.is_winner DESC
        ) AS ordered_leaderboard_entries
      ),
      'games', (
        SELECT jsonb_agg(
          to_jsonb(ordered_games)
        )
        FROM (
          SELECT * FROM games g
          WHERE g.league_id = c.league_id AND g.start_time < (NOW() + INTERVAL '3 days') AND g.start_time >= NOW()
          ORDER BY g.start_time ASC
        ) AS ordered_games
      )
    )
    FROM contests c
    WHERE c.contest_id = cid
    LIMIT 1
  );
END;$function$
;


