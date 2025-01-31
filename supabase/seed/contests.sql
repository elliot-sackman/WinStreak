INSERT INTO public.contests 
    (league_id, league_name, sport, target_stat, streak_length, contest_prize, 
     reentries_allowed, contest_start_datetime, contest_end_datetime, is_public, 
     contest_name, contest_description, contest_status)  
VALUES  
    -- MLB Contest (Completed, started 7 days ago)
    (3, 'Major League Baseball', 'Baseball', 'wins', 30, 100.00, TRUE, 
     NOW() - INTERVAL '7 days', NULL, TRUE, 
     'MLB Winners', 'First to 30!', 'in_progress'),  

    -- NFL Contest (In Progress, started 1 day ago, reentries not allowed)
    (2, 'National Football League', 'Football', 'wins', 10, 100.00, FALSE, 
     NOW() - INTERVAL '1 day', NULL, TRUE, 
     'NFL Winners', 'First to 10!', 'in_progress'),  

    -- NBA Contest (Scheduled, starts in 3 days, reentries allowed)
    (1, 'National Basketball Association', 'Basketball', 'wins', 20, 100.00, TRUE, 
     NOW() + INTERVAL '3 days', NULL, TRUE, 
     'NBA Winners', 'First to 20!', 'scheduled');  
