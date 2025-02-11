alter table "public"."contests" add column "contest_name_slug" text;

CREATE UNIQUE INDEX contests_contest_name_slug_key ON public.contests USING btree (contest_name_slug);

alter table "public"."contests" add constraint "contests_contest_name_slug_key" UNIQUE using index "contests_contest_name_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_contest_slug()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE 
    base_slug TEXT;
    new_slug TEXT;
    slug_count INT;
BEGIN
    -- Convert contest_name to lowercase, replace spaces with dashes, and remove special characters
    base_slug := regexp_replace(lower(NEW.contest_name), '[^a-z0-9]+', '-', 'g');

    -- Check if the base slug already exists
    SELECT COUNT(*) INTO slug_count FROM public.contests WHERE contest_name_slug = base_slug;

    IF slug_count = 0 THEN
        -- If no conflicts, use the base slug
        new_slug := base_slug;
    ELSE
        -- Find the highest numbered slug with this base
        SELECT COALESCE(MAX(CAST(substring(contest_name_slug FROM '[0-9]+$') AS INTEGER)), 0) + 1
        INTO slug_count
        FROM public.contests
        WHERE contest_name_slug ~ ('^' || base_slug || '(-[0-9]+)?$');

        -- Append the next number to the slug
        new_slug := base_slug || '-' || slug_count;
    END IF;

    -- Set the new slug
    NEW.contest_name_slug := new_slug;

    RETURN NEW;
END;
$function$
;

CREATE TRIGGER trigger_generate_contest_slug BEFORE INSERT ON public.contests FOR EACH ROW EXECUTE FUNCTION generate_contest_slug();


