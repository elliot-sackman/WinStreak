import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js";
import { GAME_STATUS_MAP } from "../_shared/constants.ts";
import {
  ApiSportsGamesResponse,
  WinStreakUpdateCompletedGameObject,
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

  const leagueToExistingGameApiIdToGameIdMap =
    await getLeagueToExistingGameApiIdToGameIdMap(
      activeLeagueIds,
      supabase,
      true,
    );

  const completedGames: WinStreakUpdateCompletedGameObject[] = [];

  for (const result of results) {
    const {
      sport,
      data,
    } = result;

    // We're only looking for completed games at this point
    const {
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

      // If the game is completed, and hasn't already been processed, we parse it so we can get the fields that need updating
      if (
        completed.includes(status.short) &&
        leagueToExistingGameApiIdToGameIdMap[supabaseLeagueId][apiGameId]
      ) {
        const existingGameId =
          leagueToExistingGameApiIdToGameIdMap[supabaseLeagueId][apiGameId];

        completedGames.push({
          game_id: existingGameId,
          home_team_score: scores.home.total,
          home_team_win: scores.home.total > scores.away.total,
          away_team_score: scores.away.total,
          away_team_win: scores.away.total > scores.home.total,
          status: "completed",
        });
      }
    }
  }

  return completedGames;
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

  const completedGames = await parseGameResults(results, supabase);

  return new Response(JSON.stringify({ completedGames }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
