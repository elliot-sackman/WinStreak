-- Load pgTAP for unit testing
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Ensure all tables exist and contain correct columns
BEGIN;

SELECT plan(10);  

-- Tables Exist
SELECT tables_are(
    'public',
    ARRAY[ 'profiles' , 'leagues' , 'teams' , 'games' , 'contests' , 'picks' , 'profiles_public' , 'entries', 'sponsors'],
    'Public schema should have the correct tables.'
);

-- Profiles columns exist
SELECT columns_are(
    'public',
    'profiles',
    ARRAY[ 'id' , 'email' , 'created_at' , 'updated_at' , 'account_value' , 'birthday' , 'display_name' , 'favorite_sport' , 'first_name' , 'last_name' , 'num_wins' , 'total_winnings' , 'user_role' ],
    'Profiles table should have the correct columns.'
);

-- League columns exist
SELECT columns_are(
    'public',
    'leagues',
    ARRAY[ 'league_id' , 'league_name' , 'sport' , 'league_abbreviation' , 'league_api_id'],
    'Leagues table should have the correct columns.'
);

-- Teams columns exist
SELECT columns_are(
    'public',
    'teams',
    ARRAY[ 'team_id' , 'league_id' , 'team_sport' , 'team_location' , 'team_abbreviation' , 'team_nickname' , 'team_api_id'],
    'Teams table should have the correct columns.'
);

-- Games columns exist
SELECT columns_are(
    'public',
    'games',
    ARRAY[ 'game_id' , 'league_id' , 'start_time' , 'home_team_id' , 'home_team_abbreviation' , 'home_team_location' , 'home_team_nickname' , 'home_team_score' , 'home_team_win' , 'away_team_id' , 'away_team_abbreviation' , 'away_team_location' , 'away_team_nickname' , 'away_team_score' , 'away_team_win' , 'status' , 'game_api_id' ],
    'Games table should have the correct columns.'
);

-- Contests columns exist
SELECT columns_are(
    'public',
    'contests',
    ARRAY[ 'contest_id' , 'league_id' , 'league_name' , 'sport' , 'target_stat' , 'streak_length' , 'contest_prize' , 'reentries_allowed' , 'contest_start_datetime' , 'contest_end_datetime' , 'is_public' , 'contest_name' , 'contest_description' , 'contest_status' , 'contest_winner_user_id' , 'contest_winner_display_name' , 'contest_name_slug' , 'league_abbreviation' , 'sponsor_id' , 'sponsor_name' , 'sponsor_promo' , 'sponsor_site_url' , 'sponsor_logo_url'],
    'Contests table should have the correct columns.'
);

-- Picks columns exist
SELECT columns_are(
    'public',
    'picks',
    ARRAY[ 'pick_id' , 'contest_id' , 'user_id' , 'pick_type' , 'value' , 'game_id' , 'game_start_time' , 'display_name' , 'contest_name' , 'pick_status' , 'pick_datetime' , 'league_name' , 'league_id' , 'sport' , 'home_team_id' , 'home_team_location' , 'home_team_abbreviation' , 'home_team_nickname' , 'home_team_score' , 'home_team_win' , 'away_team_id' , 'away_team_location' , 'away_team_abbreviation' , 'away_team_nickname' , 'away_team_score' , 'away_team_win' , 'entry_id' ],
    'Picks table should have the correct columns.'
);

-- Profiles Public columns exist
SELECT columns_are(
    'public',
    'profiles_public',
    ARRAY[ 'id' , 'display_name'],
    'Public profiles table should have the correct columns.'
);

-- Entries columns exist
SELECT columns_are(
    'public',
    'entries',
    ARRAY[ 'entry_id' , 'contest_id' , 'user_id' , 'display_name' , 'entry_number' , 'created_at' , 'is_complete' , 'current_streak' , 'contest_streak_length' ],
    'Entries table should have the correct columns.'
);

-- Sponsors columns exist
SELECT columns_are(
    'public',
    'sponsors',
    ARRAY[ 'sponsor_id' , 'sponsor_name' , 'sponsor_promo' , 'sponsor_site_url' , 'sponsor_logo_url' ],
    'sponsors table should have the correct columns.'
);

-- Constraints on tables


-- Finish the test
SELECT * FROM finish();

-- Rollback the transaction to undo any changes made during the test
ROLLBACK;
