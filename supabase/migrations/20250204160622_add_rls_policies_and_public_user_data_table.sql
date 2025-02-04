create table "public"."profiles_public" (
    "id" uuid not null,
    "display_name" text
);


alter table "public"."profiles_public" enable row level security;

alter table "public"."contests" enable row level security;

alter table "public"."games" enable row level security;

alter table "public"."leagues" enable row level security;

alter table "public"."picks" enable row level security;

alter table "public"."teams" enable row level security;

CREATE UNIQUE INDEX profiles_public_pkey ON public.profiles_public USING btree (id);

alter table "public"."profiles_public" add constraint "profiles_public_pkey" PRIMARY KEY using index "profiles_public_pkey";

alter table "public"."profiles_public" add constraint "profiles_public_id_fkey" FOREIGN KEY (id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."profiles_public" validate constraint "profiles_public_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.sync_profiles_public()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO public.profiles_public (id, display_name)
  VALUES (NEW.id, NEW.display_name)
  ON CONFLICT (id) DO UPDATE
  SET display_name = EXCLUDED.display_name;

  RETURN NEW;
END;
$function$
;

grant delete on table "public"."profiles_public" to "anon";

grant insert on table "public"."profiles_public" to "anon";

grant references on table "public"."profiles_public" to "anon";

grant select on table "public"."profiles_public" to "anon";

grant trigger on table "public"."profiles_public" to "anon";

grant truncate on table "public"."profiles_public" to "anon";

grant update on table "public"."profiles_public" to "anon";

grant delete on table "public"."profiles_public" to "authenticated";

grant insert on table "public"."profiles_public" to "authenticated";

grant references on table "public"."profiles_public" to "authenticated";

grant select on table "public"."profiles_public" to "authenticated";

grant trigger on table "public"."profiles_public" to "authenticated";

grant truncate on table "public"."profiles_public" to "authenticated";

grant update on table "public"."profiles_public" to "authenticated";

grant delete on table "public"."profiles_public" to "service_role";

grant insert on table "public"."profiles_public" to "service_role";

grant references on table "public"."profiles_public" to "service_role";

grant select on table "public"."profiles_public" to "service_role";

grant trigger on table "public"."profiles_public" to "service_role";

grant truncate on table "public"."profiles_public" to "service_role";

grant update on table "public"."profiles_public" to "service_role";

create policy "Enable read access for all users"
on "public"."contests"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."games"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."leagues"
as permissive
for select
to authenticated
using (true);


create policy "Enable delete for users based on user_id"
on "public"."picks"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."picks"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on email"
on "public"."picks"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."picks"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for users based on email"
on "public"."profiles"
as permissive
for update
to public
using (((( SELECT auth.jwt() AS jwt) ->> 'email'::text) = email))
with check (((( SELECT auth.jwt() AS jwt) ->> 'email'::text) = email));


create policy "Enable read access for all users"
on "public"."profiles_public"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."teams"
as permissive
for select
to authenticated
using (true);


CREATE TRIGGER profiles_sync_trigger AFTER INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION sync_profiles_public();


