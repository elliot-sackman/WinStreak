-- Load pgTAP for unit testing
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Ensure all tables exist and contain correct columns
BEGIN;

SELECT plan(7);  

-- Tables Exist
SELECT tables_are(
    'public',
    ARRAY[ 'profiles' , 'leagues' , 'teams' , 'games' , 'contests' , 'picks' ],
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
    ARRAY[ 'league_id' , 'league_name' , 'sport' ],
    'Leagues table should have the correct columns.'
);

-- Teams columns exist
SELECT columns_are(
    'public',
    'teams',
    ARRAY[ 'team_id' , 'league_id' , 'team_sport' , 'team_location' , 'team_abbreviation' , 'team_nickname' ],
    'Teams table should have the correct columns.'
);

-- Games columns exist
SELECT columns_are(
    'public',
    'games',
    ARRAY[ 'game_id' , 'league_id' , 'start_time' , 'home_team_id' , 'home_team_abbreviation' , 'home_team_location' , 'home_team_nickname' , 'home_team_score' , 'home_team_win' , 'away_team_id' , 'away_team_abbreviation' , 'away_team_location' , 'away_team_nickname' , 'away_team_score' , 'away_team_win' , 'status' ],
    'Games table should have the correct columns.'
);

-- Contests columns exist
SELECT columns_are(
    'public',
    'contests',
    ARRAY[ 'contest_id' , 'league_id' , 'league_name' , 'sport' , 'target_stat' , 'streak_length' , 'contest_prize' , 'reentries_allowed' , 'contest_start_datetime' , 'contest_end_datetime' , 'is_public' , 'contest_name' , 'contest_description' , 'contest_status' , 'contest_winner_user_id' , 'contest_winner_display_name' ],
    'Contests table should have the correct columns.'
);

-- Picks columns exist
SELECT columns_are(
    'public',
    'picks',
    ARRAY[ 'pick_id' , 'contest_id' , 'user_id' , 'pick_type' , 'value' , 'game_id' , 'game_start_time' , 'display_name' , 'contest_name' , 'pick_status' , 'pick_datetime' , 'league_name' , 'league_id' , 'sport' ],
    'Picks table should have the correct columns.'
);

-- Constraints on tables


-- Finish the test
SELECT * FROM finish();

-- Rollback the transaction to undo any changes made during the test
ROLLBACK;
