alter table "public"."contests" add column "league_abbreviation" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.autofill_contest_league_details()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    SELECT league_name, league_abbreviation, sport INTO NEW.league_name, NEW.league_abbreviation, NEW.sport
    FROM public.leagues
    WHERE league_id = NEW.league_id LIMIT 1;
    
    RETURN NEW;
END;$function$
;

CREATE TRIGGER trigger_autofill_contest_league_details BEFORE INSERT ON public.contests FOR EACH ROW EXECUTE FUNCTION autofill_contest_league_details();


