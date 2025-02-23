-- Insert 40 MLB games ranging from 2 days ago to tomorrow

INSERT INTO public.games 
    (league_id, start_time, home_team_id, away_team_id, home_team_score, away_team_score, home_team_win, away_team_win, status)  
VALUES  
    -- MLB Games occurring 2 days ago at 7:30 PM ET (12:30 AM UTC next day)
    (1, DATE(NOW()) - INTERVAL '1 day' + TIME '00:30', 63, 64, 2, 1, TRUE, FALSE, 'completed'), --1
    (1, DATE(NOW()) - INTERVAL '1 day' + TIME '00:30', 65, 66, 1, 3, FALSE, TRUE, 'completed'), --2 
    (1, DATE(NOW()) - INTERVAL '1 day' + TIME '00:30', 67, 68, 5, 2, TRUE, FALSE, 'completed'), --3 
    (1, DATE(NOW()) - INTERVAL '1 day' + TIME '00:30', 69, 70, 3, 2, TRUE, FALSE, 'completed'), --4 
    (1, DATE(NOW()) - INTERVAL '1 day' + TIME '00:30', 71, 72, 7, 5, TRUE, FALSE, 'completed'), --5 

    -- MLB Games occurring 2 days ago at 10:00 PM ET (3:00 AM UTC next day)
    (1, DATE(NOW()) - INTERVAL '1 day' + TIME '03:00', 73, 74, 2, 6, FALSE, TRUE, 'completed'), --6
    (1, DATE(NOW()) - INTERVAL '1 day' + TIME '03:00', 75, 76, 3, 9, FALSE, TRUE, 'completed'), --7
    (1, DATE(NOW()) - INTERVAL '1 day' + TIME '03:00', 77, 78, 1, 0, TRUE, FALSE, 'completed'), --8
    (1, DATE(NOW()) - INTERVAL '1 day' + TIME '03:00', 79, 80, 2, 1, TRUE, FALSE, 'completed'), --9
    (1, DATE(NOW()) - INTERVAL '1 day' + TIME '03:00', 81, 82, 3, 7, FALSE, TRUE, 'completed'), --10

    -- MLB Games occurring yesterday at 7:30 PM ET (12:30 AM UTC next day)
    (1, DATE(NOW()) + TIME '00:30', 83, 84, 3, 4, FALSE, TRUE, 'completed'), --11
    (1, DATE(NOW()) + TIME '00:30', 85, 86, 5, 7, FALSE, TRUE, 'completed'), --12
    (1, DATE(NOW()) + TIME '00:30', 87, 88, 8, 1, TRUE, FALSE, 'completed'), --13
    (1, DATE(NOW()) + TIME '00:30', 89, 90, 5, 3, TRUE, FALSE, 'completed'), --14
    (1, DATE(NOW()) + TIME '00:30', 91, 92, 2, 6, FALSE, TRUE, 'completed'), --15

    -- MLB Games occurring yesterday at 10:00 PM ET (3:00 AM UTC next day)
    (1, DATE(NOW()) + TIME '03:00', 63, 92, 10, 2, TRUE, FALSE, 'completed'), --16
    (1, DATE(NOW()) + TIME '03:00', 64, 91, 3, 1, TRUE, FALSE, 'completed'), --17
    (1, DATE(NOW()) + TIME '03:00', 65, 90, 4, 6, FALSE, TRUE, 'completed'), --18
    (1, DATE(NOW()) + TIME '03:00', 66, 89, 5, 9, FALSE, TRUE, 'completed'), --19
    (1, DATE(NOW()) + TIME '03:00', 67, 88, 2, 3, FALSE, TRUE, 'completed'), --20

    -- MLB Games occurring Today at 7:30 PM ET (12:30 AM UTC next day)
    (1, DATE(NOW()) + INTERVAL '1 day' + TIME '00:30', 68, 87, NULL, NULL, NULL, NULL, 'scheduled'), --21
    (1, DATE(NOW()) + INTERVAL '1 day' + TIME '00:30', 69, 86, NULL, NULL, NULL, NULL, 'scheduled'), --22
    (1, DATE(NOW()) + INTERVAL '1 day' + TIME '00:30', 70, 85, NULL, NULL, NULL, NULL, 'scheduled'), --23
    (1, DATE(NOW()) + INTERVAL '1 day' + TIME '00:30', 71, 84, NULL, NULL, NULL, NULL, 'scheduled'), --24
    (1, DATE(NOW()) + INTERVAL '1 day' + TIME '00:30', 72, 83, NULL, NULL, NULL, NULL, 'scheduled'), --25

    -- MLB Games occurring Today at 10:00 PM ET (3:00 AM UTC next day)
    (1, DATE(NOW()) + INTERVAL '1 day' + TIME '03:00', 73, 82, NULL, NULL, NULL, NULL, 'scheduled'), --26
    (1, DATE(NOW()) + INTERVAL '1 day' + TIME '03:00', 74, 81, NULL, NULL, NULL, NULL, 'scheduled'), --27
    (1, DATE(NOW()) + INTERVAL '1 day' + TIME '03:00', 75, 80, NULL, NULL, NULL, NULL, 'scheduled'), --28
    (1, DATE(NOW()) + INTERVAL '1 day' + TIME '03:00', 76, 79, NULL, NULL, NULL, NULL, 'scheduled'), --29
    (1, DATE(NOW()) + INTERVAL '1 day' + TIME '03:00', 77, 63, NULL, NULL, NULL, NULL, 'scheduled'), --30

    -- MLB Games occurring Tomorrow at 7:30 PM ET (12:30 AM UTC next day)
    (1, DATE(NOW()) + INTERVAL '2 days' + TIME '00:30', 78, 64, NULL, NULL, NULL, NULL, 'scheduled'), --31
    (1, DATE(NOW()) + INTERVAL '2 days' + TIME '00:30', 79, 65, NULL, NULL, NULL, NULL, 'scheduled'), --32
    (1, DATE(NOW()) + INTERVAL '2 days' + TIME '00:30', 80, 66, NULL, NULL, NULL, NULL, 'scheduled'), --33
    (1, DATE(NOW()) + INTERVAL '2 days' + TIME '00:30', 81, 67, NULL, NULL, NULL, NULL, 'scheduled'), --34
    (1, DATE(NOW()) + INTERVAL '2 days' + TIME '00:30', 82, 68, NULL, NULL, NULL, NULL, 'scheduled'), --35

    -- MLB Games occurring Tomorrow at 10:00 PM ET (2:00 AM UTC next day)
    (1, DATE(NOW()) + INTERVAL '2 days' + TIME '03:00', 83, 69, NULL, NULL, NULL, NULL, 'scheduled'), --36
    (1, DATE(NOW()) + INTERVAL '2 days' + TIME '03:00', 84, 70, NULL, NULL, NULL, NULL, 'scheduled'), --37
    (1, DATE(NOW()) + INTERVAL '2 days' + TIME '03:00', 85, 71, NULL, NULL, NULL, NULL, 'scheduled'), --38
    (1, DATE(NOW()) + INTERVAL '2 days' + TIME '03:00', 86, 72, NULL, NULL, NULL, NULL, 'scheduled'), --39
    (1, DATE(NOW()) + INTERVAL '2 days' + TIME '03:00', 87, 73, NULL, NULL, NULL, NULL, 'scheduled'); --40
