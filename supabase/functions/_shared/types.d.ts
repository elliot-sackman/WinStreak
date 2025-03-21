export type ApiSportsGamesResponse = {
  get: string;
  parameters: {
    data: string;
    league: string;
    season: string;
  };
  errors: string[];
  results: number;
  response: ApiSportsGame[];
};

export type ApiSportsGame = {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  stage: string | null;
  week: string | null;
  venue: string;
  status: {
    long: string;
    short: string;
    timer: number | null;
  };
  league: {
    id: number;
    name: string;
    type: string;
    season: string;
    logo: string;
  };
  country: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  scores: {
    home: {
      [key: string]: number | null;
      total: number;
    };
    away: {
      [key: string]: number | null;
      total: number;
    };
  };
};

export type WinStreakInsertGameObject = {
  league_id: number;
  start_time: string;
  home_team_id: number;
  away_team_id: number;
  status: "scheduled" | "in_progress" | "completed";
  game_api_id: number;
};

export type WinStreakUpdateGameObject = {
  game_id: number;
  home_team_score?: number;
  home_team_win?: boolean;
  away_team_score?: number;
  away_team_win?: boolean;
  status: "completed" | "in_progress";
};

export type WinStreakUpdatePickObject = {
  pick_id: number;
  home_team_win: boolean;
  away_team_win: boolean;
  pick_status: "correct" | "incorrect";
  pick_resolution_datetime: string;
  home_team_id: number;
  home_team_location: string;
  home_team_nickname: string;
  away_team_id: number;
  away_team_location: string;
  away_team_nickname: string;
};

export type WinStreakUpdateEntryObject = {
  entry_id: number;
  current_streak: number;
  is_complete: boolean;
  entry_completion_datetime?: string;
  first_incorrect_pick_id?: number | null;
  first_incorrect_pick_team_id?: number | null;
  first_incorrect_pick_losing_team_full_name?: string | null;
};
