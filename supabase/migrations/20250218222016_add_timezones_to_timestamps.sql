alter table "public"."contests" alter column "contest_end_datetime" set data type timestamp with time zone using "contest_end_datetime"::timestamp with time zone;

alter table "public"."contests" alter column "contest_start_datetime" set data type timestamp with time zone using "contest_start_datetime"::timestamp with time zone;

alter table "public"."entries" alter column "created_at" drop default;

alter table "public"."entries" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."games" alter column "start_time" set data type timestamp with time zone using "start_time"::timestamp with time zone;

alter table "public"."picks" alter column "game_start_time" set data type timestamp with time zone using "game_start_time"::timestamp with time zone;

alter table "public"."picks" alter column "pick_datetime" drop default;

alter table "public"."picks" alter column "pick_datetime" set data type timestamp with time zone using "pick_datetime"::timestamp with time zone;

alter table "public"."profiles" alter column "created_at" drop default;

alter table "public"."profiles" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."profiles" alter column "updated_at" drop default;

alter table "public"."profiles" alter column "updated_at" set data type timestamp with time zone using "updated_at"::timestamp with time zone;


