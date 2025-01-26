create type "public"."picks_pick_status" as enum ('pending', 'correct', 'incorrect');

create sequence "public"."picks_pick_id_seq";

create table "public"."picks" (
    "pick_id" integer not null default nextval('picks_pick_id_seq'::regclass),
    "contest_id" integer,
    "user_id" uuid,
    "pick_type" text not null,
    "value" text not null,
    "game_id" integer,
    "game_start_time" timestamp without time zone,
    "display_name" text,
    "contest_name" text,
    "pick_status" picks_pick_status default 'pending'::picks_pick_status,
    "pick_datetime" timestamp without time zone default now()
);


alter sequence "public"."picks_pick_id_seq" owned by "public"."picks"."pick_id";

CREATE UNIQUE INDEX picks_pkey ON public.picks USING btree (pick_id);

alter table "public"."picks" add constraint "picks_pkey" PRIMARY KEY using index "picks_pkey";

alter table "public"."picks" add constraint "picks_contest_id_fkey" FOREIGN KEY (contest_id) REFERENCES contests(contest_id) ON DELETE CASCADE not valid;

alter table "public"."picks" validate constraint "picks_contest_id_fkey";

alter table "public"."picks" add constraint "picks_game_id_fkey" FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE not valid;

alter table "public"."picks" validate constraint "picks_game_id_fkey";

alter table "public"."picks" add constraint "picks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."picks" validate constraint "picks_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.auto_fill_pick_details()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Autofill pick_type based on contest's target_stat
    SELECT target_stat INTO NEW.pick_type
    FROM public.contests
    WHERE contest_id = NEW.contest_id LIMIT 1;

    -- Autofill game_start_time from the associated game
    SELECT start_time INTO NEW.game_start_time
    FROM public.games
    WHERE game_id = NEW.game_id LIMIT 1;

    -- Autofill display_name from the profiles table based on user_id
    SELECT display_name INTO NEW.display_name
    FROM public.profiles
    WHERE user_id = NEW.user_id LIMIT 1;

    -- Autofill contest_name from the contests table
    SELECT contest_name INTO NEW.contest_name
    FROM public.contests
    WHERE contest_id = NEW.contest_id LIMIT 1;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.validate_pick_type()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- If pick_type is 'wins', ensure that 'value' matches either home_team_id or away_team_id for the associated game
    IF NEW.pick_type = 'wins' THEN
        IF NOT EXISTS (
            SELECT 1 
            FROM public.games 
            WHERE game_id = NEW.game_id
            AND (home_team_id = NEW.value OR away_team_id = NEW.value)
        ) THEN
            RAISE EXCEPTION 'Invalid team ID for pick. Team must be either home or away team in the game.';
        END IF;
    END IF;

    RETURN NEW;
END;
$function$
;

grant delete on table "public"."picks" to "anon";

grant insert on table "public"."picks" to "anon";

grant references on table "public"."picks" to "anon";

grant select on table "public"."picks" to "anon";

grant trigger on table "public"."picks" to "anon";

grant truncate on table "public"."picks" to "anon";

grant update on table "public"."picks" to "anon";

grant delete on table "public"."picks" to "authenticated";

grant insert on table "public"."picks" to "authenticated";

grant references on table "public"."picks" to "authenticated";

grant select on table "public"."picks" to "authenticated";

grant trigger on table "public"."picks" to "authenticated";

grant truncate on table "public"."picks" to "authenticated";

grant update on table "public"."picks" to "authenticated";

grant delete on table "public"."picks" to "service_role";

grant insert on table "public"."picks" to "service_role";

grant references on table "public"."picks" to "service_role";

grant select on table "public"."picks" to "service_role";

grant trigger on table "public"."picks" to "service_role";

grant truncate on table "public"."picks" to "service_role";

grant update on table "public"."picks" to "service_role";

CREATE TRIGGER trigger_auto_fill_pick_details BEFORE INSERT ON public.picks FOR EACH ROW EXECUTE FUNCTION auto_fill_pick_details();

CREATE TRIGGER trigger_validate_pick_type BEFORE INSERT ON public.picks FOR EACH ROW EXECUTE FUNCTION validate_pick_type();


