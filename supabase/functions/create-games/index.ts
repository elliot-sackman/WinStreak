// This script runs once daily to pull in all games from the next week and create any that are not currently in the database.

import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js";
import { GAME_STATUS_MAP } from "../_shared/constants.ts";
import {
  ApiSportsGamesResponse,
  WinStreakInsertGameObject,
} from "../_shared/types.d.ts";
import {
  fetchGames,
  getActiveLeagueIds,
  getLeagueIdToTeamApiIdToTeamIdMap,
  getLeagueToExistingGameApiIdToGameIdMap,
  getSportToLeagueApiIdToLeagueIdMap,
} from "../_shared/utils.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
  : null;

const API_SPORTS_API_KEY = Deno.env.get("API_SPORTS_API_KEY");

//-----------------------------------------------------------------
// UTIL FUNCTIONS - MAY BE MOVED TO A NEW LOCATION FOR READABILITY
const parseGameResults = async (results: {
  sport: string;
  data: ApiSportsGamesResponse;
}[], supabase: SupabaseClient) => {
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

    const {
      scheduled,
      for_deletion,
    } = GAME_STATUS_MAP[sport];

    for (const game of data.response) {
      const {
        id: apiGameId,
        date,
        status,
        league,
        teams,
      } = game;

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
  return { gamesToAdd, gameIdsToDelete };
};

const insertNewGamesToSupabase = async (
  gamesToAdd: WinStreakInsertGameObject[],
  supabase: SupabaseClient,
) => {
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
};

const deletePostponedAndCanceledGamesFromSupabase = async (
  gameIdsToDelete: number[],
  supabase: SupabaseClient,
) => {
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
};
// END UTIL FUNCTIONS
//-----------------------------------------------------------------

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

  const { results, errors } = await fetchGames(headers, false);

  if (errors.length > 0) {
    console.error("errors: ", errors);
    return new Response(JSON.stringify({ errors }), { status: 500 });
  }

  const { gamesToAdd, gameIdsToDelete } = await parseGameResults(
    results,
    supabase,
  );

  insertNewGamesToSupabase(gamesToAdd, supabase);
  deletePostponedAndCanceledGamesFromSupabase(gameIdsToDelete, supabase);

  return new Response(
    JSON.stringify({ addedGames: gamesToAdd, deletedGames: gameIdsToDelete }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  );
});
