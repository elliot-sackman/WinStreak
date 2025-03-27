import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js";
import { GAME_STATUS_MAP } from "../_shared/constants.ts";
import {
  ApiSportsGamesResponse,
  WinStreakUpdateGameObject,
} from "../_shared/types.d.ts";
import {
  fetchGames,
  getActiveLeagueIds,
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

  // This query should only return game ID's for games that are not complete.
  const leagueToExistingGameApiIdToGameIdMap =
    await getLeagueToExistingGameApiIdToGameIdMap(
      activeLeagueIds,
      supabase,
      true,
    );

  const updateGames: WinStreakUpdateGameObject[] = [];
  const completedGameIds: number[] = [];

  for (const result of results) {
    const {
      sport,
      data,
    } = result;

    // We're only looking for completed games at this point
    const {
      in_progress,
      completed,
    } = GAME_STATUS_MAP[sport];

    for (const game of data.response) {
      const {
        id: apiGameId,
        status,
        league,
        scores,
      } = game;

      const leagueApiId = league.id;
      const supabaseLeagueId =
        sportToLeagueApiIdToLeagueIdMap[sport][leagueApiId];

      const existingGameId =
        leagueToExistingGameApiIdToGameIdMap[supabaseLeagueId][apiGameId];
      // If the game is completed, and hasn't already been processed, we store its ID to send to
      // the update-picks-and-entries background function.
      // By waiting to process the complete games in the background function, we ensure we don't drop any games in case of timeouts
      if (
        completed.includes(status.short) &&
        existingGameId && scores.home.total !== null &&
        scores.away.total !== null
      ) {
        completedGameIds.push(
          existingGameId,
        );
      }

      if (
        (in_progress.includes(status.short) ||
          completed.includes(status.short)) &&
        existingGameId
      ) {
        // We include both in_progress and completed games here, but we leave the status in_progress
        // The update to 'completed' and determination of the winner will be left to the update-picks-and-entries function
        updateGames.push({
          game_id: existingGameId,
          home_team_score: scores.home.total || 0,
          away_team_score: scores.away.total || 0,
          status: "in_progress",
        });
      }
    }
  }

  return { updateGames, completedGameIds };
};

const updateGamesInSupabase = async (
  updateGames: WinStreakUpdateGameObject[],
  supabase: SupabaseClient,
) => {
  if (updateGames.length > 0) {
    const updatePromises = updateGames.map((game) =>
      supabase
        .from("games")
        .update(game) // Only updates provided columns
        .eq("game_id", game.game_id) // Targets specific row
    );

    const results = await Promise.all(updatePromises);

    const errors = results.filter(({ error }) => error);
    if (errors.length > 0) {
      console.error("Errors updating games:", errors);
    } else {
      console.log(
        `Successfully updated game IDs: ${updateGames.map((g) => g.game_id)}`,
      );
    }
  } else {
    console.log("No games to update.");
  }
};

const sendCompletedGameIdsToBackgroundFunction = async (
  completedGameIds: number[],
  supabase: SupabaseClient,
) => {
  if (completedGameIds.length > 0) {
    const { data, error } = await supabase.functions.invoke(
      "update-picks-and-entries-for-completed-games",
      {
        body: { completedGameIds },
      },
    );

    if (error) {
      console.error("Error invoking background function:", error);
    } else {
      console.log(
        `Completed games ${completedGameIds} sent to update-picks-and-entries.`,
      );
      console.log(data);
    }
  } else {
    console.log("No completed games to send to update-picks-and-entries");
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

  const { results, errors } = await fetchGames(headers, true);

  if (errors.length > 0) {
    console.error("errors: ", errors);
    return new Response(JSON.stringify({ errors }), { status: 500 });
  }

  const { updateGames, completedGameIds } = await parseGameResults(
    results,
    supabase,
  );

  await updateGamesInSupabase(updateGames, supabase);
  await sendCompletedGameIdsToBackgroundFunction(completedGameIds, supabase);

  return new Response(JSON.stringify({ updateGames, completedGameIds }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
    //data,
  });
});
