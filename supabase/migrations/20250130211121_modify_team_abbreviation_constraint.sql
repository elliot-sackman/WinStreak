alter table "public"."teams" drop constraint "teams_team_abbreviation_key";

drop index if exists "public"."teams_team_abbreviation_key";

CREATE UNIQUE INDEX teams_league_abbreviation_key ON public.teams USING btree (league_id, team_abbreviation);

alter table "public"."teams" add constraint "teams_league_abbreviation_key" UNIQUE using index "teams_league_abbreviation_key";


