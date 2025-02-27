drop trigger if exists "trigger_auto_fill_team_details" on "public"."games";

drop function if exists "public"."auto_fill_team_details"();

alter table "public"."games" add column "away_team_primary_hex_color" text;

alter table "public"."games" add column "away_team_secondary_hex_color" text;

alter table "public"."games" add column "home_team_primary_hex_color" text;

alter table "public"."games" add column "home_team_secondary_hex_color" text;

alter table "public"."teams" add column "team_primary_hex_color" text;

alter table "public"."teams" add column "team_secondary_hex_color" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.auto_fill_game_teams_details()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    -- Fetch home team details and set the fields
    SELECT team_abbreviation, team_location, team_nickname, team_primary_hex_color, team_secondary_hex_color INTO NEW.home_team_abbreviation, NEW.home_team_location, NEW.home_team_nickname, NEW.home_team_primary_hex_color, NEW.home_team_secondary_hex_color
    FROM public.teams 
    WHERE team_id = NEW.home_team_id LIMIT 1;

    -- Fetch away team details and set the fields
    SELECT team_abbreviation, team_location, team_nickname, team_primary_hex_color, team_secondary_hex_color INTO NEW.away_team_abbreviation, NEW.away_team_location, NEW.away_team_nickname, NEW.away_team_primary_hex_color, NEW.away_team_secondary_hex_color
    FROM public.teams 
    WHERE team_id = NEW.away_team_id LIMIT 1;

    RETURN NEW;
END;$function$
;

CREATE TRIGGER trigger_auto_fill_game_teams_details BEFORE INSERT ON public.games FOR EACH ROW EXECUTE FUNCTION auto_fill_game_teams_details();


