set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_live_contests_and_user_entries_for_dashboard(uid uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN jsonb_build_object(
    'contests',
      (SELECT jsonb_agg(to_jsonb(c))
       FROM contests c
       WHERE c.contest_status = 'in_progress'),
    'entries',
      (SELECT jsonb_agg(to_jsonb(e))
       FROM entries e
       WHERE e.user_id = uid AND e.is_complete = false)
  );
END;$function$
;


