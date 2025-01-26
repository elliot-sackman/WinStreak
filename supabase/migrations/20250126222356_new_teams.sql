create sequence "public"."teams_team_id_seq";

create table "public"."teams" (
    "team_id" integer not null default nextval('teams_team_id_seq'::regclass),
    "league_id" integer,
    "team_sport" text,
    "team_location" text,
    "team_abbreviation" text,
    "team_nickname" text
);


alter sequence "public"."teams_team_id_seq" owned by "public"."teams"."team_id";

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (team_id);

CREATE UNIQUE INDEX teams_team_abbreviation_key ON public.teams USING btree (team_abbreviation);

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."teams" add constraint "teams_league_id_fkey" FOREIGN KEY (league_id) REFERENCES leagues(league_id) ON DELETE CASCADE not valid;

alter table "public"."teams" validate constraint "teams_league_id_fkey";

alter table "public"."teams" add constraint "teams_team_abbreviation_key" UNIQUE using index "teams_team_abbreviation_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.enforce_uppercase_team_abbreviation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.team_abbreviation := UPPER(NEW.team_abbreviation);
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."teams" to "anon";

grant insert on table "public"."teams" to "anon";

grant references on table "public"."teams" to "anon";

grant select on table "public"."teams" to "anon";

grant trigger on table "public"."teams" to "anon";

grant truncate on table "public"."teams" to "anon";

grant update on table "public"."teams" to "anon";

grant delete on table "public"."teams" to "authenticated";

grant insert on table "public"."teams" to "authenticated";

grant references on table "public"."teams" to "authenticated";

grant select on table "public"."teams" to "authenticated";

grant trigger on table "public"."teams" to "authenticated";

grant truncate on table "public"."teams" to "authenticated";

grant update on table "public"."teams" to "authenticated";

grant delete on table "public"."teams" to "service_role";

grant insert on table "public"."teams" to "service_role";

grant references on table "public"."teams" to "service_role";

grant select on table "public"."teams" to "service_role";

grant trigger on table "public"."teams" to "service_role";

grant truncate on table "public"."teams" to "service_role";

grant update on table "public"."teams" to "service_role";

CREATE TRIGGER trigger_uppercase_team_abbreviation BEFORE INSERT OR UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION enforce_uppercase_team_abbreviation();


