INSERT INTO public.games 
    (league_id, start_time, home_team_id, away_team_id, home_team_score, away_team_score, home_team_win, away_team_win, status)  
VALUES  
    -- Games that have already happened (populated scores and winners)
    (1, NOW() - INTERVAL '3 days', 1, 2, 110, 98, TRUE, FALSE, 'completed'),  -- Celtics beat Knicks  
    (2, NOW() - INTERVAL '1 day', 4, 5, 21, 28, FALSE, TRUE, 'completed'),  -- Rams beat Patriots  
    (3, NOW() - INTERVAL '2 days', 7, 8, 4, 6, FALSE, TRUE, 'completed'), -- Yankees beat Red Sox  

    -- A game happening right now (scores still NULL)
    (1, NOW() - INTERVAL '5 minutes', 3, 1, NULL, NULL, NULL, NULL, 'in_progress'), -- Lakers vs. Celtics  

    -- A game slightly in the future (still scheduled)
    (2, NOW() + INTERVAL '30 minutes', 6, 4, NULL, NULL, NULL, NULL, 'scheduled'),  -- Chiefs vs. Patriots  

    -- Future games (status scheduled, scores NULL)
    (1, NOW() + INTERVAL '3 days', 2, 3, NULL, NULL, NULL, NULL, 'scheduled'),  -- Knicks vs. Lakers  
    (2, NOW() + INTERVAL '4 days', 5, 6, NULL, NULL, NULL, NULL, 'scheduled'),    -- Rams vs. Chiefs  
    (3, NOW() + INTERVAL '5 days', 9, 7, NULL, NULL, NULL, NULL, 'scheduled');      -- Dodgers vs. Red Sox  
