set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.enter_contest(curr_user_id uuid, curr_contest_id integer)
 RETURNS text
 LANGUAGE plpgsql
AS $function$DECLARE
  active_entry_count INT;
  curr_contest_status TEXT;
BEGIN
  -- Check if the user already has an active entry in the contest
  SELECT COUNT(*)
  INTO active_entry_count
  FROM entries
  WHERE user_id = curr_user_id
    AND contest_id = curr_contest_id
    AND is_complete = FALSE;

  IF active_entry_count > 0 THEN
    RETURN 'User already has an active entry in this contest.';
  END IF;

  -- Check if the contest is in_progress
  SELECT contest_status
  INTO curr_contest_status
  FROM contests
  WHERE contest_id = curr_contest_id;

  IF curr_contest_status != 'in_progress' THEN
    RETURN 'Contest is not in progress.';
  END IF;

  -- Insert the new entry
  INSERT INTO entries (user_id, contest_id, created_at)
  VALUES (curr_user_id, curr_contest_id, NOW());

  RETURN 'Entry successfully created.';
END;$function$
;


