INSERT INTO auth.users
    (id, instance_id, email, encrypted_password, raw_user_meta_data, raw_app_meta_data, created_at, updated_at, email_confirmed_at, aud, role)
VALUES
    ('5f2c9b3f-35e2-4354-923c-df6a1f188f79', '00000000-0000-0000-0000-000000000000', 'seed_test1@gmail.com', '$2a$10$fWHdz1zlzPfXVbxuHmX4fODOxCPoSvWCDi9Jg6liQPUjZjxI6u9wu', '{"sub":"5f2c9b3f-35e2-4354-923c-df6a1f188f79", "email_verified":true, "first_name":"seed", "last_name": "one", "username":"seed one"}', '{"provider": "email","providers": ["email"]}', NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
    ('83ebd17c-2ac9-4492-8685-1419de175e40', '00000000-0000-0000-0000-000000000000', 'seed_test2@gmail.com', '$2a$10$fWHdz1zlzPfXVbxuHmX4fODOxCPoSvWCDi9Jg6liQPUjZjxI6u9wu', '{"sub":"83ebd17c-2ac9-4492-8685-1419de175e40","email_verified":true, "first_name":"seed", "last_name": "two", "username":"seed two"}', '{"provider": "email","providers": ["email"]}', NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
    ('a4d555f1-5f88-4907-b3c5-57909be0a848', '00000000-0000-0000-0000-000000000000', 'seed_test3@gmail.com', '$2a$10$fWHdz1zlzPfXVbxuHmX4fODOxCPoSvWCDi9Jg6liQPUjZjxI6u9wu', '{"sub":"a4d555f1-5f88-4907-b3c5-57909be0a848","email_verified":true, "first_name":"seed", "last_name": "three", "username":"seed three"}', '{"provider": "email","providers": ["email"]}', NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
    ('b1d9d7f9-0ddb-4a62-a8dd-9d50fef1ecd4', '00000000-0000-0000-0000-000000000000', 'seed_test4@gmail.com', '$2a$10$fWHdz1zlzPfXVbxuHmX4fODOxCPoSvWCDi9Jg6liQPUjZjxI6u9wu', '{"sub":"b1d9d7f9-0ddb-4a62-a8dd-9d50fef1ecd4","email_verified":true, "first_name":"seed", "last_name": "four", "username":"seed four"}', '{"provider": "email","providers": ["email"]}', NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
    ('cadff429-22e7-426f-8f22-d2caa285fb81', '00000000-0000-0000-0000-000000000000', 'seed_test5@gmail.com', '$2a$10$fWHdz1zlzPfXVbxuHmX4fODOxCPoSvWCDi9Jg6liQPUjZjxI6u9wu', '{"sub":"cadff429-22e7-426f-8f22-d2caa285fb81","email_verified":true, "first_name":"seed", "last_name": "five", "username":"seed five"}', '{"provider": "email","providers": ["email"]}', NOW(), NOW(), NOW(), 'authenticated', 'authenticated');

UPDATE public.profiles
SET 
    birthday = CASE email
        WHEN 'seed_test1@gmail.com' THEN '1990-01-01'::DATE
        WHEN 'seed_test2@gmail.com' THEN '1992-05-15'::DATE
        WHEN 'seed_test3@gmail.com' THEN '1988-11-20'::DATE
        WHEN 'seed_test4@gmail.com' THEN '1995-07-30'::DATE
        WHEN 'seed_test5@gmail.com' THEN '1993-09-10'::DATE
        ELSE NULL
    END,
    favorite_sport = CASE email
        WHEN 'seed_test1@gmail.com' THEN 'Basketball'
        WHEN 'seed_test2@gmail.com' THEN 'Soccer'
        WHEN 'seed_test3@gmail.com' THEN 'Tennis'
        WHEN 'seed_test4@gmail.com' THEN 'Baseball'
        WHEN 'seed_test5@gmail.com' THEN 'Football'
        ELSE NULL
    END;

