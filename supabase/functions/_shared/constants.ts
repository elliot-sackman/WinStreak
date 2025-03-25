const API_BASE_URLS: { [key: string]: string } = {
  basketball: "https://v1.basketball.api-sports.io",
  baseball: "https://v1.baseball.api-sports.io",
};

const GAME_STATUS_MAP: { [key: string]: { [key: string]: string[] } } = {
  basketball: {
    scheduled: ["NS"],
    in_progress: ["Q1", "Q2", "Q3", "Q4", "OT", "BT", "HT"],
    completed: ["FT", "AOT"],
    for_deletion: ["POST", "CANC", "SUSP", "PST"],
  },
  baseball: {
    scheduled: ["NS"],
    in_progress: [
      "INTR",
      "IN1",
      "IN2",
      "IN3",
      "IN4",
      "IN5",
      "IN6",
      "IN7",
      "IN8",
      "IN9",
      "IN10",
      "IN11",
      "IN12",
      "IN13",
      "IN14",
      "IN15",
      "IN16",
      "IN17",
      "IN18",
      "IN19",
      "IN20",
    ],
    completed: ["FT"],
    for_deletion: ["POST", "CANC", "SUSP", "PST", "ABD"],
  },
};

const ACTIVE_LEAGUES: { [key: string]: string[] } = {
  "basketball": ["NBA"],
  "baseball": ["MLB"],
};

// Eventually add this to database?
const LEAGUE_INFO_MAP: {
  [key: string]: { leagueApiId: number; season: string; daysInAdvance: number };
} = {
  "NBA": { leagueApiId: 12, season: "2024-2025", daysInAdvance: 6 },
  "MLB": { leagueApiId: 1, season: "2025", daysInAdvance: 4 },
};

export { ACTIVE_LEAGUES, API_BASE_URLS, GAME_STATUS_MAP, LEAGUE_INFO_MAP };
