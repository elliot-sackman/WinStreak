create type "public"."contest_status" as enum ('scheduled', 'in_progress', 'ended');

create type "public"."contest_target_stat" as enum ('wins');

create sequence "public"."contests_contest_id_seq";

create table "public"."contests" (
    "contest_id" integer not null default nextval('contests_contest_id_seq'::regclass),
    "league_id" integer,
    "league_name" text,
    "sport" text not null,
    "target_stat" contest_target_stat not null default 'wins'::contest_target_stat,
    "streak_length" integer not null,
    "contest_prize" double precision not null,
    "reentries_allowed" boolean default false,
    "contest_start_datetime" timestamp without time zone not null,
    "contest_end_datetime" timestamp without time zone,
    "is_public" boolean default true,
    "contest_name" text not null,
    "contest_description" text,
    "contest_status" contest_status not null default 'scheduled'::contest_status,
    "contest_winner_user_id" uuid,
    "contest_winner_display_name" text
);


alter sequence "public"."contests_contest_id_seq" owned by "public"."contests"."contest_id";

CREATE UNIQUE INDEX contests_pkey ON public.contests USING btree (contest_id);

alter table "public"."contests" add constraint "contests_pkey" PRIMARY KEY using index "contests_pkey";

alter table "public"."contests" add constraint "contests_contest_winner_user_id_fkey" FOREIGN KEY (contest_winner_user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."contests" validate constraint "contests_contest_winner_user_id_fkey";

alter table "public"."contests" add constraint "contests_league_id_fkey" FOREIGN KEY (league_id) REFERENCES leagues(league_id) ON DELETE CASCADE not valid;

alter table "public"."contests" validate constraint "contests_league_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.auto_fill_contest_winner_display_name()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.contest_winner_user_id IS NOT NULL THEN
        -- Fetch winner's display name from profiles table
        SELECT display_name INTO NEW.contest_winner_display_name
        FROM public.profiles
        WHERE user_id = NEW.contest_winner_user_id LIMIT 1;
    ELSE
        NEW.contest_winner_display_name := NULL;
    END IF;
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."contests" to "anon";

grant insert on table "public"."contests" to "anon";

grant references on table "public"."contests" to "anon";

grant select on table "public"."contests" to "anon";

grant trigger on table "public"."contests" to "anon";

grant truncate on table "public"."contests" to "anon";

grant update on table "public"."contests" to "anon";

grant delete on table "public"."contests" to "authenticated";

grant insert on table "public"."contests" to "authenticated";

grant references on table "public"."contests" to "authenticated";

grant select on table "public"."contests" to "authenticated";

grant trigger on table "public"."contests" to "authenticated";

grant truncate on table "public"."contests" to "authenticated";

grant update on table "public"."contests" to "authenticated";

grant delete on table "public"."contests" to "service_role";

grant insert on table "public"."contests" to "service_role";

grant references on table "public"."contests" to "service_role";

grant select on table "public"."contests" to "service_role";

grant trigger on table "public"."contests" to "service_role";

grant truncate on table "public"."contests" to "service_role";

grant update on table "public"."contests" to "service_role";

CREATE TRIGGER trigger_auto_fill_contest_winner_display_name BEFORE INSERT OR UPDATE ON public.contests FOR EACH ROW EXECUTE FUNCTION auto_fill_contest_winner_display_name();


