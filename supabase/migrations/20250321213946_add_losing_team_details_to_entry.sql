alter table "public"."entries" add column "first_incorrect_pick_losing_team_full_name" text;

alter table "public"."entries" add column "first_incorrect_pick_losing_team_id" integer;

alter table "public"."entries" add constraint "entries_first_incorrect_pick_losing_team_id_fkey" FOREIGN KEY (first_incorrect_pick_losing_team_id) REFERENCES teams(team_id) not valid;

alter table "public"."entries" validate constraint "entries_first_incorrect_pick_losing_team_id_fkey";


