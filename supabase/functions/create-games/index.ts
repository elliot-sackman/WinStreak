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
  const potentialGamesToUpdate: {
    game_id: number;
    start_time: string;
  }[] = [];
  const gameIdsToDelete: { game_id: number }[] = [];

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
        } else {
          // If the game already exists, we may need to update its start time
          const existingGameId =
            leagueToExistingGameApiIdToGameIdMap[supabaseLeagueId][apiGameId];

          potentialGamesToUpdate.push({
            game_id: existingGameId,
            start_time: date,
          });
        }
      } else if (for_deletion.includes(status.short)) {
        // If the game is postponed, canceled, etc, we need to delete this game and all related picks
        const existingGameId =
          leagueToExistingGameApiIdToGameIdMap[supabaseLeagueId][apiGameId];

        if (existingGameId) {
          gameIdsToDelete.push({ game_id: existingGameId });
        }
      }
    }
  }
  return { gamesToAdd, potentialGamesToUpdate, gameIdsToDelete };
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

  const { gamesToAdd, potentialGamesToUpdate, gameIdsToDelete } =
    await parseGameResults(
      results,
      supabase,
    );

  const { error } = await supabase.rpc("handle_game_operations", {
    games_to_add: gamesToAdd,
    potential_games_to_update: potentialGamesToUpdate,
    game_ids_to_delete: gameIdsToDelete,
  });

  if (error) {
    console.error("Error in RPC:", error.message);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  console.log(
    `Added ${gamesToAdd.length} new games, updated ${potentialGamesToUpdate.length} game times, and deleted ${gameIdsToDelete.length} games.`,
  );

  return new Response(
    JSON.stringify({
      addedGames: gamesToAdd,
      updatedGameTimes: potentialGamesToUpdate,
      deletedGames: gameIdsToDelete,
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  );
});
