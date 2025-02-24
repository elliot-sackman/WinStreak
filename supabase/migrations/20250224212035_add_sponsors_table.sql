create sequence "public"."sponsors_sponsor_id_seq";

drop trigger if exists "trigger_autofill_contest_league_details" on "public"."contests";

drop function if exists "public"."autofill_contest_league_details"();

create table "public"."sponsors" (
    "sponsor_id" integer not null default nextval('sponsors_sponsor_id_seq'::regclass),
    "sponsor_name" text not null,
    "sponsor_promo" text,
    "sponsor_logo_url" text,
    "sponsor_site_url" text
);


alter table "public"."contests" add column "sponsor_id" integer;

alter table "public"."contests" add column "sponsor_logo_url" text;

alter table "public"."contests" add column "sponsor_name" text;

alter table "public"."contests" add column "sponsor_promo" text;

alter table "public"."contests" add column "sponsor_site_url" text;

alter sequence "public"."sponsors_sponsor_id_seq" owned by "public"."sponsors"."sponsor_id";

CREATE UNIQUE INDEX sponsors_pkey ON public.sponsors USING btree (sponsor_id);

alter table "public"."sponsors" add constraint "sponsors_pkey" PRIMARY KEY using index "sponsors_pkey";

alter table "public"."contests" add constraint "fk_sponsor_id" FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id) ON DELETE SET NULL not valid;

alter table "public"."contests" validate constraint "fk_sponsor_id";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.autofill_contest_details()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    -- League Details
    SELECT league_name, league_abbreviation, sport INTO NEW.league_name, NEW.league_abbreviation, NEW.sport
    FROM public.leagues
    WHERE league_id = NEW.league_id LIMIT 1;

    -- Sponsor Details
    SELECT sponsor_name, sponsor_promo, sponsor_site_url, sponsor_logo_url INTO NEW.sponsor_name, NEW.sponsor_promo, NEW.sponsor_site_url, NEW.sponsor_logo_url
    FROM public.sponsors
    WHERE sponsor_id = NEW.sponsor_id LIMIT 1;
    
    RETURN NEW;
END;$function$
;

grant delete on table "public"."sponsors" to "anon";

grant insert on table "public"."sponsors" to "anon";

grant references on table "public"."sponsors" to "anon";

grant select on table "public"."sponsors" to "anon";

grant trigger on table "public"."sponsors" to "anon";

grant truncate on table "public"."sponsors" to "anon";

grant update on table "public"."sponsors" to "anon";

grant delete on table "public"."sponsors" to "authenticated";

grant insert on table "public"."sponsors" to "authenticated";

grant references on table "public"."sponsors" to "authenticated";

grant select on table "public"."sponsors" to "authenticated";

grant trigger on table "public"."sponsors" to "authenticated";

grant truncate on table "public"."sponsors" to "authenticated";

grant update on table "public"."sponsors" to "authenticated";

grant delete on table "public"."sponsors" to "service_role";

grant insert on table "public"."sponsors" to "service_role";

grant references on table "public"."sponsors" to "service_role";

grant select on table "public"."sponsors" to "service_role";

grant trigger on table "public"."sponsors" to "service_role";

grant truncate on table "public"."sponsors" to "service_role";

grant update on table "public"."sponsors" to "service_role";

CREATE TRIGGER trigger_autofill_contest_details BEFORE INSERT ON public.contests FOR EACH ROW EXECUTE FUNCTION autofill_contest_details();


