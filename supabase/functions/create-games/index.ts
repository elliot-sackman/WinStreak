// This script runs once daily to pull in all games from the next week and create any that are not currently in the database.
// TODO: How to programmatically remove postponed/canceled games

import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js";
import {
  ACTIVE_LEAGUES,
  API_BASE_URLS,
  GAME_STATUS_MAP,
  LEAGUE_INFO_MAP,
} from "../_shared/constants.ts";
import {
  ApiSportsGamesResponse,
  WinStreakInsertGameObject,
} from "../_shared/types.d.ts";
import { games } from "../_shared/games.ts";

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
  const sportToLeagueApiIdToLeagueIdMap: {
    [key: string]: { [key: number]: number };
  } = {};

  leagues?.forEach((league) => {
    const {
      league_id,
      league_api_id,
      sport,
    } = league;

    if (!(sport in sportToLeagueApiIdToLeagueIdMap)) {
      sportToLeagueApiIdToLeagueIdMap[sport.toLowerCase()] = {};
    }

    sportToLeagueApiIdToLeagueIdMap[sport.toLowerCase()][league_api_id] =
      league_id;
  });

  return sportToLeagueApiIdToLeagueIdMap;
};

const getActiveLeagueIds = (sportToLeagueApiIdToLeagueIdMap: {
  [key: string]: { [key: number]: number };
}) => {
  const activeLeagueIds: number[] = [];
  Object.keys(ACTIVE_LEAGUES).forEach((sport: string) => {
    const activeLeagueAbbreviations = ACTIVE_LEAGUES[sport];
    activeLeagueAbbreviations.forEach((leagueAbbreviation: string) => {
      const leagueApiId = LEAGUE_INFO_MAP[leagueAbbreviation].leagueApiId;
      activeLeagueIds.push(sportToLeagueApiIdToLeagueIdMap[sport][leagueApiId]);
    });
  });

  return activeLeagueIds;
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
      `Error fetching teams for league IDs ${activeLeagueIds}: ${error.message}`,
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

  return leagueIdToTeamApiIdToTeamIdMap;
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
      "start_time",
      todayDateString,
    );

  if (error) {
    console.error(
      `Error fetching games for league IDs ${activeLeagueIds}: ${error.message}`,
    );
  }

  // Object maps leagueId: {gameApiId: gameId}
  const leagueToExistingGameApiIdToGameIdMap: {
    [key: number]: { [key: number]: number };
  } = {};

  activeLeagueIds.forEach((leagueId) =>
    leagueToExistingGameApiIdToGameIdMap[leagueId] = {}
  );

  games?.forEach((game) => {
    const {
      league_id,
      game_api_id,
      game_id,
    } = game;

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

  if (!supabase) {
    return new Response("Supabase client not initialized", { status: 500 });
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
    for (const leagueAbbreviation of ACTIVE_LEAGUES[sport]) {
      const {
        leagueApiId,
        season,
        daysInAdvance,
      } = LEAGUE_INFO_MAP[leagueAbbreviation];

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

          const data: ApiSportsGamesResponse = await response.json();
          results.push({ sport, data });
        } catch (error) {
          errors.push(`Failed for league ${leagueAbbreviation}: ${error}`);
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error("errors: ", errors);
    return new Response(JSON.stringify({ errors }), { status: 500 });
  }

  const sportToLeagueApiIdToLeagueIdMap =
    await getSportToLeagueApiIdToLeagueIdMap(supabase);
  const activeLeagueIds = getActiveLeagueIds(sportToLeagueApiIdToLeagueIdMap);
  const leagueIdToTeamApiIdToTeamIdMap =
    await getLeagueIdToTeamApiIdToTeamIdMap(activeLeagueIds, supabase);
  const leagueToExistingGameApiIdToGameIdMap =
    await getLeagueToExistingGameApiIdToGameIdMap(activeLeagueIds, supabase);

  const gamesToAdd: WinStreakInsertGameObject[] = [];
  const gameIdsToDelete: number[] = [];

  for (const result of results) {
    const {
      sport,
      data,
    } = result;

    for (const game of data.response) {
      const {
        id: apiGameId,
        date,
        status,
        league,
        teams,
      } = game;

      const {
        scheduled,
        for_deletion,
      } = GAME_STATUS_MAP[sport];

      const leagueApiId = league.id;
      const supabaseLeagueId =
        sportToLeagueApiIdToLeagueIdMap[sport][leagueApiId];

      // If the game is scheduled, we check if it already exists in the db before adding
      if (scheduled.includes(status.short)) {
        if (
          !leagueToExistingGameApiIdToGameIdMap[supabaseLeagueId][apiGameId]
        ) {
          gamesToAdd.push({
            league_id: supabaseLeagueId,
            start_time: date,
            home_team_id:
              leagueIdToTeamApiIdToTeamIdMap[supabaseLeagueId][teams.home.id],
            away_team_id:
              leagueIdToTeamApiIdToTeamIdMap[supabaseLeagueId][teams.away.id],
            status: "scheduled",
            game_api_id: apiGameId,
          });
        }
      } else if (for_deletion.includes(status.short)) {
        // If the game is postponed, canceled, etc, we need to delete this game and all related picks
        const existingGameId =
          leagueToExistingGameApiIdToGameIdMap[supabaseLeagueId][apiGameId];

        if (existingGameId) {
          gameIdsToDelete.push(existingGameId);
        }
      }
    }
  }

  if (gamesToAdd.length > 0) {
    const { error } = await supabase.from("games").insert(gamesToAdd);

    if (error) {
      console.error("Error inserting games:", error.message);
    } else {
      console.log(`Inserted ${gamesToAdd.length} new games`);
    }
  } else {
    console.log("No new games to insert.");
  }

  if (gameIdsToDelete.length > 0) {
    // Step 1: Delete picks for the games
    const { error: picksError } = await supabase
      .from("picks")
      .delete()
      .in("game_id", gameIdsToDelete);

    if (picksError) {
      console.error("Error deleting picks:", picksError.message);
    } else {
      console.log(`Deleted picks for ${gameIdsToDelete.length} games`);
      // Step 2: Delete the games themselves
      const { error: gamesError } = await supabase
        .from("games")
        .delete()
        .in("game_id", gameIdsToDelete);

      if (gamesError) {
        console.error("Error deleting games:", gamesError.message);
      } else {
        console.log(`Deleted ${gameIdsToDelete.length} games`);
      }
    }
  } else {
    console.log("No games to delete.");
  }

  return new Response(
    JSON.stringify({ addedGames: gamesToAdd, deletedGames: gameIdsToDelete }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  );
});
