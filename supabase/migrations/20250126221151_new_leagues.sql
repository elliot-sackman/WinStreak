create sequence "public"."leagues_league_id_seq";

create table "public"."leagues" (
    "league_id" integer not null default nextval('leagues_league_id_seq'::regclass),
    "league_name" text not null,
    "sport" text not null
);


alter sequence "public"."leagues_league_id_seq" owned by "public"."leagues"."league_id";

CREATE UNIQUE INDEX leagues_pkey ON public.leagues USING btree (league_id);

alter table "public"."leagues" add constraint "leagues_pkey" PRIMARY KEY using index "leagues_pkey";

grant delete on table "public"."leagues" to "anon";

grant insert on table "public"."leagues" to "anon";

grant references on table "public"."leagues" to "anon";

grant select on table "public"."leagues" to "anon";

grant trigger on table "public"."leagues" to "anon";

grant truncate on table "public"."leagues" to "anon";

grant update on table "public"."leagues" to "anon";

grant delete on table "public"."leagues" to "authenticated";

grant insert on table "public"."leagues" to "authenticated";

grant references on table "public"."leagues" to "authenticated";

grant select on table "public"."leagues" to "authenticated";

grant trigger on table "public"."leagues" to "authenticated";

grant truncate on table "public"."leagues" to "authenticated";

grant update on table "public"."leagues" to "authenticated";

grant delete on table "public"."leagues" to "service_role";

grant insert on table "public"."leagues" to "service_role";

grant references on table "public"."leagues" to "service_role";

grant select on table "public"."leagues" to "service_role";

grant trigger on table "public"."leagues" to "service_role";

grant truncate on table "public"."leagues" to "service_role";

grant update on table "public"."leagues" to "service_role";


