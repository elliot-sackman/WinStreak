INSERT INTO auth.users
    (id, email, encrypted_password, raw_user_meta_data)
VALUES
    (gen_random_uuid(), 'seed_test1@gmail.com', '$2a$10$xpJ43DNgHiW.eOVjfMr89u2OJZuMAfPktkfXlxMNufn.TYljyxwZ6', '{"first_name":"seed", "last_name": "one", "username":"seed one"}'),
    (gen_random_uuid(), 'seed_test2@gmail.com', '$2a$10$xpJ43DNgHiW.eOVjfMr89u2OJZuMAfPktkfXlxMNufn.TYljyxwZ6', '{"first_name":"seed", "last_name": "two", "username":"seed two"}'),
    (gen_random_uuid(), 'seed_test3@gmail.com', '$2a$10$xpJ43DNgHiW.eOVjfMr89u2OJZuMAfPktkfXlxMNufn.TYljyxwZ6', '{"first_name":"seed", "last_name": "three", "username":"seed three"}'),
    (gen_random_uuid(), 'seed_test4@gmail.com', '$2a$10$xpJ43DNgHiW.eOVjfMr89u2OJZuMAfPktkfXlxMNufn.TYljyxwZ6', '{"first_name":"seed", "last_name": "four", "username":"seed four"}'),
    (gen_random_uuid(), 'seed_test5@gmail.com', '$2a$10$xpJ43DNgHiW.eOVjfMr89u2OJZuMAfPktkfXlxMNufn.TYljyxwZ6', '{"first_name":"seed", "last_name": "five", "username":"seed five"}');

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

