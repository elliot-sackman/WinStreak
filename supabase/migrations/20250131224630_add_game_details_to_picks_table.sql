alter table "public"."picks" add column "away_team_abbreviation" text;

alter table "public"."picks" add column "away_team_id" integer;

alter table "public"."picks" add column "away_team_location" text;

alter table "public"."picks" add column "away_team_nickname" text;

alter table "public"."picks" add column "away_team_score" integer;

alter table "public"."picks" add column "away_team_win" boolean;

alter table "public"."picks" add column "home_team_abbreviation" text;

alter table "public"."picks" add column "home_team_id" integer;

alter table "public"."picks" add column "home_team_location" text;

alter table "public"."picks" add column "home_team_nickname" text;

alter table "public"."picks" add column "home_team_score" integer;

alter table "public"."picks" add column "home_team_win" boolean;

alter table "public"."picks" add constraint "fk_away_team" FOREIGN KEY (away_team_id) REFERENCES teams(team_id) not valid;

alter table "public"."picks" validate constraint "fk_away_team";

alter table "public"."picks" add constraint "fk_home_team" FOREIGN KEY (home_team_id) REFERENCES teams(team_id) not valid;

alter table "public"."picks" validate constraint "fk_home_team";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.auto_fill_pick_details()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    -- Autofill pick_type based on contest's target_stat
    SELECT target_stat INTO NEW.pick_type
    FROM public.contests
    WHERE contest_id = NEW.contest_id LIMIT 1;

    -- Autofill league_id based on contest's league_id
    SELECT league_id INTO NEW.league_id
    FROM public.contests
    WHERE contest_id = NEW.contest_id LIMIT 1;

    -- Autofill league_name based on contest's league_name
    SELECT league_name INTO NEW.league_name
    FROM public.contests
    WHERE contest_id = NEW.contest_id LIMIT 1;

    -- Autofill sport based on contest's sport
    SELECT sport INTO NEW.sport
    FROM public.contests
    WHERE contest_id = NEW.contest_id LIMIT 1;

    -- Autofill game details from the associated game
    SELECT 
        start_time, 
        home_team_id, home_team_location, home_team_abbreviation, home_team_nickname, home_team_score, home_team_win,
        away_team_id, away_team_location, away_team_abbreviation, away_team_nickname, away_team_score, away_team_win
    INTO 
        NEW.game_start_time,
        NEW.home_team_id, NEW.home_team_location, NEW.home_team_abbreviation, NEW.home_team_nickname, NEW.home_team_score, NEW.home_team_win,
        NEW.away_team_id, NEW.away_team_location, NEW.away_team_abbreviation, NEW.away_team_nickname, NEW.away_team_score, NEW.away_team_win
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


