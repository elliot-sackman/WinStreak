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
  contest_winner_user_id: string | null;
  contest_winner_display_name: string | null;
  contest_name_slug: string;
  league_abbreviation: string;
  sponsor_id: number | null;
  sponsor_name: string | null;
  sponsor_promo: string | null;
  sponsor_site_url: string | null;
  sponsor_logo_url: string | null;
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
}

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
}

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
}
export type existingPicksObject = {
  [gameId: number]: {
    teamId: number;
    pickId: number;
  };
};
export type newPicksObject = {
  [gameId: number]: number;
};
