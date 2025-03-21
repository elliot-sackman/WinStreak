alter table "public"."entries" add column "entry_completion_datetime" timestamp with time zone;

alter table "public"."entries" add column "first_incorrect_pick_id" integer;

alter table "public"."entries" add constraint "entries_first_incorrect_pick_id_fkey" FOREIGN KEY (first_incorrect_pick_id) REFERENCES picks(pick_id) not valid;

alter table "public"."entries" validate constraint "entries_first_incorrect_pick_id_fkey";


