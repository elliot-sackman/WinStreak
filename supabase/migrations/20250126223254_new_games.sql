create type "public"."game_status" as enum ('scheduled', 'in_progress', 'completed', 'postponed');

create sequence "public"."games_game_id_seq";

create table "public"."games" (
    "game_id" integer not null default nextval('games_game_id_seq'::regclass),
    "league_id" integer,
    "start_time" timestamp without time zone not null,
    "home_team_id" integer,
    "home_team_abbreviation" text not null,
    "home_team_location" text not null,
    "home_team_nickname" text not null,
    "home_team_score" integer default 0,
    "home_team_win" boolean,
    "away_team_id" integer,
    "away_team_abbreviation" text not null,
    "away_team_location" text not null,
    "away_team_nickname" text not null,
    "away_team_score" integer default 0,
    "away_team_win" boolean,
    "status" game_status not null default 'scheduled'::game_status
);


alter sequence "public"."games_game_id_seq" owned by "public"."games"."game_id";

CREATE UNIQUE INDEX games_pkey ON public.games USING btree (game_id);

alter table "public"."games" add constraint "games_pkey" PRIMARY KEY using index "games_pkey";

alter table "public"."games" add constraint "games_away_team_id_fkey" FOREIGN KEY (away_team_id) REFERENCES teams(team_id) ON DELETE CASCADE not valid;

alter table "public"."games" validate constraint "games_away_team_id_fkey";

alter table "public"."games" add constraint "games_home_team_id_fkey" FOREIGN KEY (home_team_id) REFERENCES teams(team_id) ON DELETE CASCADE not valid;

alter table "public"."games" validate constraint "games_home_team_id_fkey";

alter table "public"."games" add constraint "games_league_id_fkey" FOREIGN KEY (league_id) REFERENCES leagues(league_id) ON DELETE CASCADE not valid;

alter table "public"."games" validate constraint "games_league_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.auto_fill_team_details()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Fetch home team details and set the fields
    SELECT team_abbreviation, team_location, team_nickname INTO NEW.home_team_abbreviation, NEW.home_team_location, NEW.home_team_nickname
    FROM public.teams 
    WHERE team_id = NEW.home_team_id LIMIT 1;

    -- Fetch away team details and set the fields
    SELECT team_abbreviation, team_location, team_nickname INTO NEW.away_team_abbreviation, NEW.away_team_location, NEW.away_team_nickname
    FROM public.teams 
    WHERE team_id = NEW.away_team_id LIMIT 1;

    RETURN NEW;
END;
$function$
;

grant delete on table "public"."games" to "anon";

grant insert on table "public"."games" to "anon";

grant references on table "public"."games" to "anon";

grant select on table "public"."games" to "anon";

grant trigger on table "public"."games" to "anon";

grant truncate on table "public"."games" to "anon";

grant update on table "public"."games" to "anon";

grant delete on table "public"."games" to "authenticated";

grant insert on table "public"."games" to "authenticated";

grant references on table "public"."games" to "authenticated";

grant select on table "public"."games" to "authenticated";

grant trigger on table "public"."games" to "authenticated";

grant truncate on table "public"."games" to "authenticated";

grant update on table "public"."games" to "authenticated";

grant delete on table "public"."games" to "service_role";

grant insert on table "public"."games" to "service_role";

grant references on table "public"."games" to "service_role";

grant select on table "public"."games" to "service_role";

grant trigger on table "public"."games" to "service_role";

grant truncate on table "public"."games" to "service_role";

grant update on table "public"."games" to "service_role";

CREATE TRIGGER trigger_auto_fill_team_details BEFORE INSERT ON public.games FOR EACH ROW EXECUTE FUNCTION auto_fill_team_details();


