-- Generate picks for 5 seed users for 40 MLB games - League ID = 1
INSERT INTO public.picks 
    (contest_id, entry_id, user_id, pick_type, value, game_id, pick_status, pick_datetime)
VALUES
    -- Seed 1 Picks - user id = '5f2c9b3f-35e2-4354-923c-df6a1f188f79'
    -- 6 game streak
    (1, 1, '5f2c9b3f-35e2-4354-923c-df6a1f188f79', 'wins', 63, 1, 'correct', NOW() - INTERVAL '3 days'),
    (1, 1, '5f2c9b3f-35e2-4354-923c-df6a1f188f79', 'wins', 67, 3, 'correct', NOW() - INTERVAL '3 days'),
    (1, 1, '5f2c9b3f-35e2-4354-923c-df6a1f188f79', 'wins', 69, 4, 'correct', NOW() - INTERVAL '3 days'),
    (1, 1, '5f2c9b3f-35e2-4354-923c-df6a1f188f79', 'wins', 77, 8, 'correct', NOW() - INTERVAL '2 days'),
    (1, 1, '5f2c9b3f-35e2-4354-923c-df6a1f188f79', 'wins', 86, 12, 'correct', NOW() - INTERVAL '2 days'),
    (1, 1, '5f2c9b3f-35e2-4354-923c-df6a1f188f79', 'wins', 89, 19, 'correct', NOW() - INTERVAL '2 days'),

    -- Seed 2 Picks - user id = '83ebd17c-2ac9-4492-8685-1419de175e40'
    -- 8 game streak
    (1, 2, '83ebd17c-2ac9-4492-8685-1419de175e40', 'wins', 63, 1, 'correct', NOW() - INTERVAL '3 days'),
    (1, 2, '83ebd17c-2ac9-4492-8685-1419de175e40', 'wins', 67, 3, 'correct', NOW() - INTERVAL '3 days'),
    (1, 2, '83ebd17c-2ac9-4492-8685-1419de175e40', 'wins', 69, 4, 'correct', NOW() - INTERVAL '3 days'),
    (1, 2, '83ebd17c-2ac9-4492-8685-1419de175e40', 'wins', 77, 8, 'correct', NOW() - INTERVAL '2 days'),
    (1, 2, '83ebd17c-2ac9-4492-8685-1419de175e40', 'wins', 86, 12, 'correct', NOW() - INTERVAL '2 days'),
    (1, 2, '83ebd17c-2ac9-4492-8685-1419de175e40', 'wins', 87, 13, 'correct', NOW() - INTERVAL '2 days'),
    (1, 2, '83ebd17c-2ac9-4492-8685-1419de175e40', 'wins', 88, 20, 'correct', NOW() - INTERVAL '2 days'),
    (1, 2, '83ebd17c-2ac9-4492-8685-1419de175e40', 'wins', 89, 19, 'correct', NOW() - INTERVAL '2 days'),

    -- Seed 3 Picks - user id = 'a4d555f1-5f88-4907-b3c5-57909be0a848'
    -- 4 game streak
    (1, 3, 'a4d555f1-5f88-4907-b3c5-57909be0a848', 'wins', 69, 4, 'correct', NOW() - INTERVAL '3 days'),
    (1, 3, 'a4d555f1-5f88-4907-b3c5-57909be0a848', 'wins', 77, 8, 'correct', NOW() - INTERVAL '2 days'),
    (1, 3, 'a4d555f1-5f88-4907-b3c5-57909be0a848', 'wins', 86, 12, 'correct', NOW() - INTERVAL '2 days'),
    (1, 3, 'a4d555f1-5f88-4907-b3c5-57909be0a848', 'wins', 87, 13, 'correct', NOW() - INTERVAL '2 days'),

    -- Seed 4 Picks - user id = 'b1d9d7f9-0ddb-4a62-a8dd-9d50fef1ecd4'
    -- 5 game streak
    (1, 4, 'b1d9d7f9-0ddb-4a62-a8dd-9d50fef1ecd4', 'wins', 77, 8, 'correct', NOW() - INTERVAL '2 days'),
    (1, 4, 'b1d9d7f9-0ddb-4a62-a8dd-9d50fef1ecd4', 'wins', 86, 12, 'correct', NOW() - INTERVAL '2 days'),
    (1, 4, 'b1d9d7f9-0ddb-4a62-a8dd-9d50fef1ecd4', 'wins', 87, 13, 'correct', NOW() - INTERVAL '2 days'),
    (1, 4, 'b1d9d7f9-0ddb-4a62-a8dd-9d50fef1ecd4', 'wins', 88, 20, 'correct', NOW() - INTERVAL '2 days'),
    (1, 4, 'b1d9d7f9-0ddb-4a62-a8dd-9d50fef1ecd4', 'wins', 89, 19, 'correct', NOW() - INTERVAL '2 days'),

    -- Seed 5 Picks - user id = 'cadff429-22e7-426f-8f22-d2caa285fb81'
    -- 2 game streak
    (1, 5, 'cadff429-22e7-426f-8f22-d2caa285fb81', 'wins', 88, 20, 'correct', NOW() - INTERVAL '2 days'),
    (1, 5, 'cadff429-22e7-426f-8f22-d2caa285fb81', 'wins', 89, 19, 'correct', NOW() - INTERVAL '2 days');
