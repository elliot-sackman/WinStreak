// This script runs once daily to pull in all games from the next week and create any that are not currently in the database.
// TODO: How to programmatically remove postponed/canceled games

import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js";
import {
  ACTIVE_LEAGUES,
  API_BASE_URLS,
  GAME_STATUS_MAP,
  LEAGUE_INFO_MAP,
} from "../_shared/constants.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
  : null;

const API_SPORTS_API_KEY = Deno.env.get("API_SPORTS_API_KEY");

//-----------------------------------------------------------------
// UTIL FUNCTIONS - MAY BE MOVED TO A NEW LOCATION FOR READABILITY
const getSportToLeagueApiIdToLeagueIdMap = async (supabase: SupabaseClient) => {
  const { data: leagues, error } = await supabase.from("leagues").select(
    "league_id,league_api_id,sport",
  );

  if (error) {
    console.error(
      `Error fetching leagues: ${error}`,
    );
  }
  const sportToLeagueIdToLeagueApiIdMap: {
    [key: string]: { [key: number]: number };
  } = {};

  leagues?.forEach((league) => {
    const {
      league_id,
      league_api_id,
      sport,
    } = league;

    if (!(sport in sportToLeagueIdToLeagueApiIdMap)) {
      sportToLeagueIdToLeagueApiIdMap[sport.lower()] = {};
    }

    sportToLeagueIdToLeagueApiIdMap[sport.lower()][league_api_id] = league_id;
  });

  return sportToLeagueIdToLeagueApiIdMap;
};

const getLeagueIdToTeamApiIdToTeamIdMap = async (
  activeLeagueIds: number[],
  supabase: SupabaseClient,
) => {
  const { data: teams, error } = await supabase.from("teams").select(
    "team_id,team_api_id,league_id",
  ).in("league_id", activeLeagueIds);

  if (error) {
    console.error(
      `Error fetching teams for league IDs ${activeLeagueIds}: ${error}`,
    );
  }

  const leagueIdToTeamApiIdToTeamIdMap: {
    [key: number]: { [key: number]: number };
  } = {};
  teams?.forEach((team) => {
    const {
      team_id,
      team_api_id,
      league_id,
    } = team;

    if (!(league_id in leagueIdToTeamApiIdToTeamIdMap)) {
      leagueIdToTeamApiIdToTeamIdMap[league_id] = {};
    }

    leagueIdToTeamApiIdToTeamIdMap[league_id][team_api_id] = team_id;
  });
};

const getLeagueToExistingGameApiIdToGameIdMap = async (
  activeLeagueIds: number[],
  supabase: SupabaseClient,
) => {
  const todayDateString = new Date().toISOString().split("T")[0];
  const { data: games, error } = await supabase.from("games")
    .select("game_id,game_api_id,league_id")
    .in(
      "league_id",
      activeLeagueIds,
    )
    .gte(
      "game_start_time",
      todayDateString,
    );

  if (error) {
    console.error(
      `Error fetching games for league IDs ${activeLeagueIds}: ${error}`,
    );
  }

  // Object maps leagueId: {gameApiId: gameId}
  const leagueToExistingGameApiIdToGameIdMap: {
    [key: number]: { [key: number]: number };
  } = {};

  games?.forEach((game) => {
    const {
      league_id,
      game_api_id,
      game_id,
    } = game;

    if (!(league_id in leagueToExistingGameApiIdToGameIdMap)) {
      leagueToExistingGameApiIdToGameIdMap[league_id] = {};
    }

    leagueToExistingGameApiIdToGameIdMap[league_id][game_api_id] = game_id;
  });

  return leagueToExistingGameApiIdToGameIdMap;
};

const buildRequestUrls = (
  apiUrl: string,
  leagueApiId: number,
  daysInAdvance: number,
  season: string,
) => {
  const currentDate = new Date();
  const urls = [];

  for (let i = 0; i < daysInAdvance; i++) {
    const dateFilter = currentDate.toISOString().split("T")[0];
    urls.push(
      `${apiUrl}/games?date=${dateFilter}&league=${leagueApiId}&season=${season}`,
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return urls;
};

Deno.serve(async (_req: Request) => {
  if (!API_SPORTS_API_KEY) {
    return new Response("no environment vars", { status: 500 });
  }

  const headers = new Headers({
    "x-apisports-key": API_SPORTS_API_KEY,
    "Accept": "application/json",
  });

  const errors = [];
  const results = [];

  // Iterate through active sports to specify the apiUrl
  for (const sport of Object.keys(ACTIVE_LEAGUES)) {
    const apiUrl = API_BASE_URLS[sport];
    // Iterate through the currently active leagues (as far as we're concerned)
    for (const league of ACTIVE_LEAGUES[sport]) {
      const {
        leagueApiId,
        season,
        daysInAdvance,
      } = LEAGUE_INFO_MAP[league];

      const requestUrls = buildRequestUrls(
        apiUrl,
        leagueApiId,
        daysInAdvance,
        season,
      );

      for (const url of requestUrls) {
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: headers,
          });

          if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
          }

          const data = await response.json();
          results.push({ league, data });
        } catch (error) {
          errors.push(`Failed for league ${league}: ${error}`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error("errors: ", errors);
    return new Response(JSON.stringify({ errors }), { status: 500 });
  }

  const gameIds = [];
  const rawGames = [];

  for (const result of results) {
    const {
      league,
      data,
    } = result;

    for (const game of data.response) {
    }
  }

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
