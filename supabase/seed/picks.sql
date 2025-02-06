WITH user_ids AS (
    SELECT id, email
    FROM auth.users
    WHERE email IN (
        'seed_test1@gmail.com',
        'seed_test2@gmail.com',
        'seed_test3@gmail.com',
        'seed_test4@gmail.com',
        'seed_test5@gmail.com'
    )
),
entries_lookup AS (
    SELECT e.entry_id, e.user_id, e.contest_id
    FROM public.entries e
    WHERE e.contest_id IN (1, 2)  -- MLB (1) & NFL (2)
),
games_with_picks AS (
    SELECT 
        g.game_id, 
        g.league_id,
        g.start_time, 
        g.home_team_id, 
        g.away_team_id,
        g.home_team_win,
        g.away_team_win,
        CASE 
            WHEN g.start_time < NOW() - INTERVAL '1 day' THEN 'completed'
            WHEN g.start_time < NOW() THEN 'in_progress'
            ELSE 'scheduled'
        END AS game_status
    FROM public.games g
    WHERE g.league_id IN (2, 3)  -- NFL (2) & MLB (3)
),
selected_picks AS (
    SELECT 
        g.game_id,
        g.league_id,
        g.start_time,
        g.game_status,
        -- Explicitly assign a picked team randomly
        CASE WHEN random() > 0.5 THEN g.home_team_id ELSE g.away_team_id END AS picked_team,
        g.home_team_id,
        g.away_team_id,
        g.home_team_win,
        g.away_team_win
    FROM games_with_picks g
)
INSERT INTO public.picks (contest_id, entry_id, user_id, pick_type, value, game_id, pick_status, pick_datetime)
SELECT 
    e.contest_id,  -- Get contest_id from entries
    e.entry_id,    -- Assign entry_id from entries
    u.id AS user_id,
    'wins' AS pick_type,
    s.picked_team AS value,  -- Use the alias for picked team
    s.game_id,
    -- Determine pick status based on game completion and if the pick was correct
    CASE 
        WHEN s.game_status = 'completed' AND 
             ((s.home_team_win AND s.picked_team = s.home_team_id) OR 
              (s.away_team_win AND s.picked_team = s.away_team_id)) THEN 'correct'::picks_pick_status
        WHEN s.game_status = 'completed' THEN 'incorrect'::picks_pick_status
        ELSE 'pending'::picks_pick_status
    END AS pick_status,
    -- Set pick_datetime 12 hours before game start, or NOW() for future games
    CASE 
        WHEN s.game_status IN ('completed', 'in_progress') THEN s.start_time - INTERVAL '12 hours'
        ELSE NOW()
    END AS pick_datetime
FROM user_ids u  
CROSS JOIN selected_picks s
JOIN entries_lookup e ON e.user_id = u.id  
    AND e.contest_id = CASE WHEN s.league_id = 3 THEN 1 ELSE 2 END;  -- Match entry to contest_id
