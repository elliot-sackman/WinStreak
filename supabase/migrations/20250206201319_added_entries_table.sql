create sequence "public"."entries_entry_id_seq";

create table "public"."entries" (
    "entry_id" integer not null default nextval('entries_entry_id_seq'::regclass),
    "contest_id" integer not null,
    "user_id" uuid not null,
    "display_name" text,
    "entry_number" integer default 0,
    "created_at" timestamp without time zone default now(),
    "is_complete" boolean default false,
    "current_streak" integer default 0,
    "contest_streak_length" integer
);


alter table "public"."picks" add column "entry_id" integer;

alter sequence "public"."entries_entry_id_seq" owned by "public"."entries"."entry_id";

CREATE UNIQUE INDEX entries_pkey ON public.entries USING btree (entry_id);

alter table "public"."entries" add constraint "entries_pkey" PRIMARY KEY using index "entries_pkey";

alter table "public"."entries" add constraint "entries_contest_id_fkey" FOREIGN KEY (contest_id) REFERENCES contests(contest_id) ON DELETE CASCADE not valid;

alter table "public"."entries" validate constraint "entries_contest_id_fkey";

alter table "public"."entries" add constraint "entries_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."entries" validate constraint "entries_user_id_fkey";

alter table "public"."picks" add constraint "picks_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES entries(entry_id) ON DELETE CASCADE not valid;

alter table "public"."picks" validate constraint "picks_entry_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.autofill_entries_fields()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    last_entry_number INTEGER;
BEGIN
    -- Autofill display_name from public.profiles
    IF NEW.display_name IS NULL THEN
        NEW.display_name := (SELECT display_name FROM public.profiles WHERE id = NEW.user_id);
    END IF;

    -- Autofill contest_streak_length from contests table
    IF NEW.contest_streak_length IS NULL THEN
        NEW.contest_streak_length := (SELECT streak_length FROM contests WHERE contest_id = NEW.contest_id);
    END IF;

    -- Find the last entry_number for this contest/user combo
    SELECT entry_number INTO last_entry_number
    FROM entries
    WHERE contest_id = NEW.contest_id AND user_id = NEW.user_id
    ORDER BY entry_number DESC
    LIMIT 1;

    -- Increment entry_number if a previous entry exists, otherwise start at 0
    IF last_entry_number IS NOT NULL THEN
        NEW.entry_number := last_entry_number + 1;
    ELSE
        NEW.entry_number := 0;
    END IF;

    RETURN NEW;
END;
$function$
;

grant delete on table "public"."entries" to "anon";

grant insert on table "public"."entries" to "anon";

grant references on table "public"."entries" to "anon";

grant select on table "public"."entries" to "anon";

grant trigger on table "public"."entries" to "anon";

grant truncate on table "public"."entries" to "anon";

grant update on table "public"."entries" to "anon";

grant delete on table "public"."entries" to "authenticated";

grant insert on table "public"."entries" to "authenticated";

grant references on table "public"."entries" to "authenticated";

grant select on table "public"."entries" to "authenticated";

grant trigger on table "public"."entries" to "authenticated";

grant truncate on table "public"."entries" to "authenticated";

grant update on table "public"."entries" to "authenticated";

grant delete on table "public"."entries" to "service_role";

grant insert on table "public"."entries" to "service_role";

grant references on table "public"."entries" to "service_role";

grant select on table "public"."entries" to "service_role";

grant trigger on table "public"."entries" to "service_role";

grant truncate on table "public"."entries" to "service_role";

grant update on table "public"."entries" to "service_role";

CREATE TRIGGER autofill_entries_before_insert BEFORE INSERT ON public.entries FOR EACH ROW EXECUTE FUNCTION autofill_entries_fields();


