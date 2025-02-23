INSERT INTO public.contests 
    (league_id, target_stat, streak_length, contest_prize, 
     reentries_allowed, contest_start_datetime, contest_end_datetime, is_public, 
     contest_name, contest_description, contest_status)  
VALUES  
    -- MLB Contest (Completed, started 7 days ago)
    (1, 'wins', 20, 500.00, TRUE, 
     NOW() - INTERVAL '7 days', NULL, TRUE, 
     'MLB Winners', 'Can you beat the famous moneyball streak? Be the first player to build a 20 game WinStreak and claim the prize!', 'in_progress'),  

    -- NBA Contest (Scheduled, starts in 3 days, reentries allowed)
    (2, 'wins', 20, 100.00, TRUE, 
     NOW() + INTERVAL '3 days', NULL, TRUE, 
     'NBA Winners', 'First to 20!', 'scheduled'),

    -- NFL Contest (In Progress, started 1 day ago, reentries not allowed)
    (3, 'wins', 10, 100.00, FALSE, 
     NOW() - INTERVAL '1 day', NULL, TRUE, 
     'NFL Winners', 'First to 10!', 'in_progress');


