alter table "public"."profiles" drop constraint "profiles_username_key";

drop index if exists "public"."profiles_username_key";

alter table "public"."profiles" drop column "username";

alter table "public"."profiles" add column "account_value" double precision default 0;

alter table "public"."profiles" add column "birthday" date;

alter table "public"."profiles" add column "display_name" character varying;

alter table "public"."profiles" add column "favorite_sport" character varying;

alter table "public"."profiles" add column "first_name" character varying;

alter table "public"."profiles" add column "last_name" character varying;

alter table "public"."profiles" add column "num_wins" integer default 0;

alter table "public"."profiles" add column "total_winnings" double precision default 0;

alter table "public"."profiles" add column "user_role" character varying default 'player'::character varying;

alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX profiles_display_name_key ON public.profiles USING btree (display_name);

alter table "public"."profiles" add constraint "profiles_display_name_key" UNIQUE using index "profiles_display_name_key";


