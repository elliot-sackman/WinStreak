export type Contest = {
  contest_id: number;
  league_id: number | null;
  league_name: string | null;
  sport: string;
  target_stat: string;
  streak_length: number;
  contest_prize: number;
  reentries_allowed: boolean;
  contest_start_datetime: string;
  contest_end_datetime: string | null;
  is_public: boolean;
  contest_name: string;
  contest_description: string | null;
  contest_status: string;
  contest_name_slug: string;
  league_abbreviation: string;
  sponsor_id: number | null;
  sponsor_name: string | null;
  sponsor_promo: string | null;
  sponsor_site_url: string | null;
  sponsor_logo_url: string | null;
  contest_winning_entry_ids: number[] | null;
};

export type Entry = {
  entry_id: number;
  contest_id: number;
  user_id: string;
  display_name: string;
  entry_number: number;
  created_at: string;
  is_complete: boolean;
  current_streak: number;
  contest_streak_length: number;
  first_incorrect_pick_id: number | null;
  first_incorrect_pick_team_id: number | null;
  first_incorrect_pick_losing_team_full_name: string | null;
  entry_completion_datetime: string | null;
  is_winner: boolean | null;
};

export type Game = {
  game_id: number;
  league_id: number;
  start_time: string;
  home_team_id: number;
  home_team_abbreviation: string;
  home_team_location: string;
  home_team_nickname: string;
  home_team_score: number | null;
  home_team_win: boolean | null;
  away_team_id: number;
  away_team_abbreviation: string;
  away_team_location: string;
  away_team_nickname: string;
  away_team_score: number | null;
  away_team_win: boolean | null;
  status: string;
  game_api_id: number | null;
  home_team_primary_hex_color: string | null;
  home_team_secondary_hex_color: string | null;
  away_team_primary_hex_color: string | null;
  away_team_secondary_hex_color: string | null;
};

export type Pick = {
  pick_id: number;
  contest_id: number;
  user_id: string;
  pick_type: string;
  value: number;
  game_id: number;
  game_start_time: string;
  display_name: string;
  contest_name: string;
  pick_status: string;
  pick_datetime: string;
  league_id: number;
  league_name: string;
  sport: string;
  home_team_id: number;
  home_team_abbreviation: string;
  home_team_location: string;
  home_team_nickname: string;
  home_team_score: number | null;
  home_team_win: boolean | null;
  away_team_id: number;
  away_team_abbreviation: string;
  away_team_location: string;
  away_team_nickname: string;
  away_team_score: number | null;
  away_team_win: boolean | null;
  entry_id: number;
  home_team_primary_hex_color: string | null;
  home_team_secondary_hex_color: string | null;
  away_team_primary_hex_color: string | null;
  away_team_secondary_hex_color: string | null;
};
export type existingPicksObject = {
  [gameId: number]: {
    teamId: number;
    pickId: number;
  };
};
export type newPicksObject = {
  [gameId: number]: number;
};

export type PicksDataByContestAndEntry = {
  contest_id: number;
  contest_name: string;
  contest_name_slug: string;
  user_entries: {
    entry_id: number;
    entry_number: number;
    current_streak: number;
    is_complete: boolean;
    is_winner: boolean;
    entry_picks: Pick[];
  }[];
};

export type AllContestGamesPicksEntries = {
  contest_details: Contest | null;
  user_entries: {
    entry_details: Entry;
    entry_picks: Pick[] | null;
  }[] | null;
  leaderboard_entries: Entry[] | null;
  games: Game[] | null;
};
