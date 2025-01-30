set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.auto_fill_contest_winner_display_name()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    IF NEW.contest_winner_user_id IS NOT NULL THEN
        -- Fetch winner's display name from profiles table
        SELECT display_name INTO NEW.contest_winner_display_name
        FROM public.profiles
        WHERE id = NEW.contest_winner_user_id LIMIT 1;
    ELSE
        NEW.contest_winner_display_name := NULL;
    END IF;
    RETURN NEW;
END;$function$
;


