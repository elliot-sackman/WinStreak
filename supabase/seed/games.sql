INSERT INTO public.games 
    (league_id, start_time, home_team_id, away_team_id, home_team_score, away_team_score, home_team_win, away_team_win, status)  
VALUES  
    -- Games that have already happened (populated scores and winners)
    (1, NOW() - INTERVAL '3 days', 1, 2, 110, 98, TRUE, FALSE, 'completed'),  -- Celtics beat Knicks  
    (2, NOW() - INTERVAL '1 day', 4, 5, 21, 28, FALSE, TRUE, 'completed'),  -- Rams beat Patriots  
    (3, NOW() - INTERVAL '2 days', 63, 64, 4, 6, FALSE, TRUE, 'completed'), -- Yankees beat Red Sox  

    -- A game happening right now (scores still NULL)
    (1, NOW() - INTERVAL '5 minutes', 3, 1, NULL, NULL, NULL, NULL, 'in_progress'), -- Lakers vs. Celtics  

    -- A game slightly in the future (still scheduled)
    (2, NOW() + INTERVAL '30 minutes', 6, 4, NULL, NULL, NULL, NULL, 'scheduled'),  -- Chiefs vs. Patriots  

    -- Future games (status scheduled, scores NULL)
    (1, NOW() + INTERVAL '3 days', 2, 3, NULL, NULL, NULL, NULL, 'scheduled'),  -- Knicks vs. Lakers  
    (2, NOW() + INTERVAL '4 days', 5, 6, NULL, NULL, NULL, NULL, 'scheduled'),    -- Rams vs. Chiefs  
    (3, NOW() + INTERVAL '5 days', 90, 63, NULL, NULL, NULL, NULL, 'scheduled'),  -- Mets vs. Red Sox  

    -- MLB Games occurring Today at 7:00 PM ET (11:00 PM UTC)
    (3, DATE(NOW()) + TIME '23:00', 63, 64, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + TIME '23:00', 65, 66, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + TIME '23:00', 67, 68, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + TIME '23:00', 69, 70, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + TIME '23:00', 71, 72, NULL, NULL, NULL, NULL, 'scheduled'),

    -- MLB Games occurring Today at 10:00 PM ET (2:00 AM UTC next day)
    (3, DATE(NOW()) + INTERVAL '1 day' + TIME '02:00', 73, 74, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '1 day' + TIME '02:00', 75, 76, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '1 day' + TIME '02:00', 77, 78, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '1 day' + TIME '02:00', 79, 80, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '1 day' + TIME '02:00', 81, 82, NULL, NULL, NULL, NULL, 'scheduled'),

    -- MLB Games occurring Tomorrow at 7:00 PM ET (11:00 PM UTC)
    (3, DATE(NOW()) + INTERVAL '1 day' + TIME '23:00', 83, 84, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '1 day' + TIME '23:00', 85, 86, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '1 day' + TIME '23:00', 87, 88, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '1 day' + TIME '23:00', 89, 90, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '1 day' + TIME '23:00', 63, 65, NULL, NULL, NULL, NULL, 'scheduled'),

    -- MLB Games occurring the Day After Tomorrow at 10:00 PM ET (2:00 AM UTC next day)
    (3, DATE(NOW()) + INTERVAL '2 days' + TIME '02:00', 66, 67, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '2 days' + TIME '02:00', 68, 69, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '2 days' + TIME '02:00', 70, 71, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '2 days' + TIME '02:00', 72, 73, NULL, NULL, NULL, NULL, 'scheduled'),
    (3, DATE(NOW()) + INTERVAL '2 days' + TIME '02:00', 74, 75, NULL, NULL, NULL, NULL, 'scheduled');
