-- Migration: Add trigger to call handle_new_user on insert into auth.users

-- Create the trigger on the auth.users table to invoke the handle_new_user function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();