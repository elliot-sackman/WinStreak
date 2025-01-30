set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.auto_fill_pick_details()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    -- Autofill pick_type based on contest's target_stat
    SELECT target_stat INTO NEW.pick_type
    FROM public.contests
    WHERE contest_id = NEW.contest_id LIMIT 1;

    -- Autofill league_id based on contests's league_id
    SELECT league_id INTO NEW.league_id
    FROM public.contests
    WHERE contest_id = NEW.contest_id LIMIT 1;

    -- Autofill league_name based on contests's league_name
    SELECT league_name INTO NEW.league_name
    FROM public.contests
    WHERE contest_id = NEW.contest_id LIMIT 1;

    -- Autofill sport based on contests's sport
    SELECT sport INTO NEW.sport
    FROM public.contests
    WHERE contest_id = NEW.contest_id LIMIT 1;

    -- Autofill game_start_time from the associated game
    SELECT start_time INTO NEW.game_start_time
    FROM public.games
    WHERE game_id = NEW.game_id LIMIT 1;

    -- Autofill display_name from the profiles table based on user_id
    SELECT display_name INTO NEW.display_name
    FROM public.profiles
    WHERE id = NEW.user_id LIMIT 1;

    -- Autofill contest_name from the contests table
    SELECT contest_name INTO NEW.contest_name
    FROM public.contests
    WHERE contest_id = NEW.contest_id LIMIT 1;

    RETURN NEW;
END;$function$
;


