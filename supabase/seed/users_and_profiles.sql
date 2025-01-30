INSERT INTO auth.users
    (id, email)
VALUES
    (gen_random_uuid(), 'seed_test1@gmail.com'),
    (gen_random_uuid(), 'seed_test2@gmail.com'),
    (gen_random_uuid(), 'seed_test3@gmail.com'),
    (gen_random_uuid(), 'seed_test4@gmail.com'),
    (gen_random_uuid(), 'seed_test5@gmail.com');

UPDATE public.profiles
SET 
    display_name = CASE email  
        WHEN 'seed_test1@gmail.com' THEN 'seed_1'
        WHEN 'seed_test2@gmail.com' THEN 'seed_2'
        WHEN 'seed_test3@gmail.com' THEN 'seed_3'
        WHEN 'seed_test4@gmail.com' THEN 'seed_4'
        WHEN 'seed_test5@gmail.com' THEN 'seed_5'
        ELSE NULL
    END,
    first_name = CASE email
        WHEN 'seed_test1@gmail.com' THEN 'John'
        WHEN 'seed_test2@gmail.com' THEN 'Jane'
        WHEN 'seed_test3@gmail.com' THEN 'Mike'
        WHEN 'seed_test4@gmail.com' THEN 'Emily'
        WHEN 'seed_test5@gmail.com' THEN 'Chris'
        ELSE NULL
    END,
    last_name = CASE email
        WHEN 'seed_test1@gmail.com' THEN 'Doe'
        WHEN 'seed_test2@gmail.com' THEN 'Smith'
        WHEN 'seed_test3@gmail.com' THEN 'Johnson'
        WHEN 'seed_test4@gmail.com' THEN 'Davis'
        WHEN 'seed_test5@gmail.com' THEN 'Brown'
        ELSE NULL
    END,
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

