alter table "public"."leagues" add column "league_abbreviation" text;

alter table "public"."leagues" add column "league_api_id" integer;

alter table "public"."teams" add column "team_api_id" integer;

CREATE UNIQUE INDEX leagues_league_api_id_key ON public.leagues USING btree (league_api_id);

CREATE UNIQUE INDEX teams_team_api_id_key ON public.teams USING btree (team_api_id);

alter table "public"."leagues" add constraint "leagues_league_api_id_key" UNIQUE using index "leagues_league_api_id_key";

alter table "public"."teams" add constraint "teams_team_api_id_key" UNIQUE using index "teams_team_api_id_key";


