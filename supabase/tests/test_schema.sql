-- Load pgTAP for unit testing
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Ensure all tables exist and contain correct columns
BEGIN;

SELECT plan(71);  

-- Tables Exist
SELECT has_table( 'profiles' );
SELECT has_table( 'leagues' );
SELECT has_table( 'teams' );
SELECT has_table( 'games' );
SELECT has_table( 'contests' );
SELECT has_table( 'picks' );

-- Profiles columns exist
SELECT has_column('profiles', 'id', 'id column should exist');
SELECT has_column('profiles', 'email', 'email column should exist');
SELECT has_column('profiles', 'created_at', 'created_at column should exist');
SELECT has_column('profiles', 'updated_at', 'updated_at column should exist');
SELECT has_column('profiles', 'account_value', 'account_value column should exist');
SELECT has_column('profiles', 'birthday', 'birthday column should exist');
SELECT has_column('profiles', 'display_name', 'display_name column should exist');
SELECT has_column('profiles', 'favorite_sport', 'favorite_sport column should exist');
SELECT has_column('profiles', 'first_name', 'first_name column should exist');
SELECT has_column('profiles', 'last_name', 'last_name column should exist');
SELECT has_column('profiles', 'num_wins', 'num_wins column should exist');
SELECT has_column('profiles', 'total_winnings', 'total_winnings column should exist');
SELECT has_column('profiles', 'user_role', 'user_role column should exist');

-- League columns exist
SELECT has_column('leagues', 'league_id', 'league_id column should exist');
SELECT has_column('leagues', 'league_name', 'league_name column should exist');
SELECT has_column('leagues', 'sport', 'sport column should exist');

-- Teams columns exist
SELECT has_column('teams', 'team_id', 'team_id column should exist');
SELECT has_column('teams', 'league_id', 'league_id column should exist');
SELECT has_column('teams', 'team_sport', 'team_sport column should exist');
SELECT has_column('teams', 'team_location', 'team_location column should exist');
SELECT has_column('teams', 'team_abbreviation', 'team_abbreviation column should exist');
SELECT has_column('teams', 'team_nickname', 'team_nickname column should exist');

-- Games columns exist
SELECT has_column('games', 'game_id', 'game_id column should exist');
SELECT has_column('games', 'league_id', 'league_id column should exist');
SELECT has_column('games', 'start_time', 'start_time column should exist');
SELECT has_column('games', 'home_team_id', 'home_team_id column should exist');
SELECT has_column('games', 'home_team_abbreviation', 'home_team_abbreviation column should exist');
SELECT has_column('games', 'home_team_location', 'home_team_location column should exist');
SELECT has_column('games', 'home_team_nickname', 'home_team_nickname column should exist');
SELECT has_column('games', 'home_team_score', 'home_team_score column should exist');
SELECT has_column('games', 'home_team_win', 'home_team_win column should exist');
SELECT has_column('games', 'away_team_id', 'away_team_id column should exist');
SELECT has_column('games', 'away_team_abbreviation', 'away_team_abbreviation column should exist');
SELECT has_column('games', 'away_team_location', 'away_team_location column should exist');
SELECT has_column('games', 'away_team_nickname', 'away_team_nickname column should exist');
SELECT has_column('games', 'away_team_score', 'away_team_score column should exist');
SELECT has_column('games', 'away_team_win', 'away_team_win column should exist');
SELECT has_column('games', 'status', 'status column should exist');

-- Contests columns exist
SELECT has_column('contests', 'contest_id', 'contest_id column should exist');
SELECT has_column('contests', 'league_id', 'league_id column should exist');
SELECT has_column('contests', 'league_name', 'league_name column should exist');
SELECT has_column('contests', 'sport', 'sport column should exist');
SELECT has_column('contests', 'target_stat', 'target_stat column should exist');
SELECT has_column('contests', 'streak_length', 'streak_length column should exist');
SELECT has_column('contests', 'contest_prize', 'contest_prize column should exist');
SELECT has_column('contests', 'reentries_allowed', 'reentries_allowed column should exist');
SELECT has_column('contests', 'contest_start_datetime', 'contest_start_datetime column should exist');
SELECT has_column('contests', 'contest_end_datetime', 'contest_end_datetime column should exist');
SELECT has_column('contests', 'is_public', 'is_public column should exist');
SELECT has_column('contests', 'contest_name', 'contest_name column should exist');
SELECT has_column('contests', 'contest_description', 'contest_description column should exist');
SELECT has_column('contests', 'contest_status', 'contest_status column should exist');
SELECT has_column('contests', 'contest_winner_user_id', 'contest_winner_user_id column should exist');
SELECT has_column('contests', 'contest_winner_display_name', 'contest_winner_display_name column should exist');

-- Picks columns exist
SELECT has_column('picks', 'pick_id', 'pick_id column should exist');
SELECT has_column('picks', 'contest_id', 'contest_id column should exist');
SELECT has_column('picks', 'user_id', 'user_id column should exist');
SELECT has_column('picks', 'pick_type', 'pick_type column should exist');
SELECT has_column('picks', 'value', 'value column should exist');
SELECT has_column('picks', 'game_id', 'game_id column should exist');
SELECT has_column('picks', 'game_start_time', 'contest_prize column should exist');
SELECT has_column('picks', 'display_name', 'display_name column should exist');
SELECT has_column('picks', 'contest_name', 'contest_name column should exist');
SELECT has_column('picks', 'pick_status', 'pick_status column should exist');
SELECT has_column('picks', 'pick_datetime', 'pick_datetime column should exist');

-- TODO: Tests for different constraints

-- Finish the test
SELECT * FROM finish();

-- Rollback the transaction to undo any changes made during the test
ROLLBACK;
