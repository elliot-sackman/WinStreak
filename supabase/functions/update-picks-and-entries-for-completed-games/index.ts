// this function will receive a request with IDs for completed games
// It will then query the database for those games, and use the scores to determine the winners.
// This function will also query the database for the picks associated with the game ID's in order to determine if they were correct or not.
// And finally, it will query for the entries associated with those picks.
// it will then parse all the data and determine how to update the games, entries, and picks
// And finally send them to the DB, where a function will handle the updates in a single transaction.
// That way, if this function fails for whatever reason, then the next update to games will resend the IDs and try again.

import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js";
import * as _mod from "jsr:@supabase/functions-js/edge-runtime.d.ts";

import {
  WinStreakUpdateEntryObject,
  WinStreakUpdateGameObject,
  WinStreakUpdatePickObject,
} from "../_shared/types.d.ts";

type entryIdToEntryAndPicksMapType = {
  [key: number]: {
    entry?: WinStreakUpdateEntryObject;
    picks: WinStreakUpdatePickObject[];
  };
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
  : null;

//-----------------------------------------------------------------
// UTIL FUNCTIONS - MAY BE MOVED TO A NEW LOCATION FOR READABILITY
const retrieveCompletedGamesAndParseWinners = async (
  completedGameIds: number[],
  supabase: SupabaseClient,
) => {
  const { data: completedGames } = await supabase.from("games").select(
    "game_id,home_team_id,home_team_score,away_team_id,away_team_score",
  ).in("game_id", completedGameIds).neq("status", "completed");

  const gameIdToWinningTeamIdMap: {
    [key: number]: {
      winningTeamId: number;
      homeTeamWin: boolean;
      awayTeamWin: boolean;
    };
  } = {};
  const updateGames: WinStreakUpdateGameObject[] = [];

  if (!completedGames || completedGames.length === 0) {
    console.error("Failed to retrieve games data from Supabase.");
    return { gameIdToWinningTeamIdMap, updateGames };
  }

  for (const game of completedGames) {
    const {
      game_id,
      home_team_id,
      home_team_score,
      away_team_id,
      away_team_score,
    } = game;

    const winningTeamId = home_team_score > away_team_score
      ? home_team_id
      : away_team_id;

    const homeTeamWin = home_team_id === winningTeamId;
    const awayTeamWin = !homeTeamWin;

    gameIdToWinningTeamIdMap[game_id] = {
      winningTeamId,
      homeTeamWin,
      awayTeamWin,
    };

    updateGames.push({
      game_id,
      home_team_win: homeTeamWin,
      away_team_win: awayTeamWin,
      status: "completed",
    });
  }

  return { gameIdToWinningTeamIdMap, updateGames };
};

const retrievePicksAndBuildEntryToPicksMap = async (
  completedGameIds: number[],
  gameIdToWinningTeamIdMap: {
    [key: number]: {
      winningTeamId: number;
      homeTeamWin: boolean;
      awayTeamWin: boolean;
    };
  },
  currentTimestamp: string,
  supabase: SupabaseClient,
) => {
  const { data: pendingPicks } = await supabase.from("picks")
    .select(
      "pick_id,entry_id,game_id,value,home_team_id,home_team_location,home_team_nickname,away_team_id,away_team_location,away_team_nickname",
    )
    .in("game_id", completedGameIds)
    .eq("pick_status", "pending")
    .order("game_start_time", { ascending: true })
    .order("pick_datetime", { ascending: true });

  const entryIdToEntryAndPicksMap: entryIdToEntryAndPicksMapType = {};

  if (!pendingPicks || pendingPicks.length === 0) {
    console.log("No picks to update related to games: ", completedGameIds);
    return { entryIdToEntryAndPicksMap };
  }

  for (const pick of pendingPicks) {
    const {
      pick_id,
      entry_id,
      game_id,
      value,
      home_team_id,
      home_team_location,
      home_team_nickname,
      away_team_id,
      away_team_location,
      away_team_nickname,
    } = pick;

    const {
      winningTeamId,
      homeTeamWin,
      awayTeamWin,
    } = gameIdToWinningTeamIdMap[game_id];

    if (!(entry_id in entryIdToEntryAndPicksMap)) {
      entryIdToEntryAndPicksMap[entry_id] = {
        picks: [],
      };
    }

    entryIdToEntryAndPicksMap[entry_id].picks.push({
      pick_id,
      home_team_win: homeTeamWin,
      away_team_win: awayTeamWin,
      pick_status: value === winningTeamId ? "correct" : "incorrect",
      pick_resolution_datetime: currentTimestamp,
      home_team_id,
      home_team_location,
      home_team_nickname,
      away_team_id,
      away_team_location,
      away_team_nickname,
    });
  }

  return { entryIdToEntryAndPicksMap };
};

const retrieveEntriesAndUpdateStreaks = async (
  entryIdToEntryAndPicksMap: entryIdToEntryAndPicksMapType,
  currentTimestamp: string,
  supabase: SupabaseClient,
) => {
  // This function pulls in any active entries if they exist
  // And updates the streak with correct picks
  // OR marks the entry complete with incorrect picks.
  // Then, it modifies the entry_id -> entry & picks map in place

  const entryIds = Object.keys(entryIdToEntryAndPicksMap).map((entryId) =>
    parseInt(entryId)
  );

  const { data: activeEntries } = await supabase.from("entries")
    .select("entry_id,current_streak")
    .in("entry_id", entryIds)
    .eq("is_complete", false);

  if (activeEntries) {
    for (const entry of activeEntries) {
      const {
        entry_id,
        current_streak,
      } = entry;

      // We assume the entry is active to start and create a variable to track the streak as it grows
      let isComplete = false;
      let currentStreak = current_streak;
      let first_incorrect_pick_id: number | null = null;
      let first_incorrect_pick_team_id: number | null = null;
      let first_incorrect_pick_losing_team_full_name: string | null = null;

      const picks = entryIdToEntryAndPicksMap[entry_id].picks;
      for (const pick of picks) {
        // If the current pick is correct and there have been no incorrect picks in the entry, increment the streak
        if (pick.pick_status === "correct" && !isComplete) {
          currentStreak = currentStreak + 1;
        } else if (pick.pick_status === "incorrect" && !isComplete) {
          // If the pick is incorrect, we change the status to complete as the entry is a loser.
          first_incorrect_pick_id = pick.pick_id;
          first_incorrect_pick_team_id = pick.home_team_win
            ? pick.away_team_id
            : pick.home_team_id;
          first_incorrect_pick_losing_team_full_name = pick.home_team_win
            ? pick.away_team_location + " " + pick.away_team_nickname
            : pick.home_team_location + " " + pick.away_team_nickname;
          isComplete = true;
        }
      }

      // Now we add the entry to the map
      entryIdToEntryAndPicksMap[entry_id].entry = {
        entry_id,
        current_streak: currentStreak,
        is_complete: isComplete,
      };

      if (isComplete) {
        entryIdToEntryAndPicksMap[entry_id].entry = {
          ...entryIdToEntryAndPicksMap[entry_id].entry,
          first_incorrect_pick_id,
          first_incorrect_pick_team_id,
          first_incorrect_pick_losing_team_full_name,
          entry_completion_datetime: currentTimestamp,
        };
      }
    }
  }
};

const extractPicksAndEntriesFromMap = (
  entryIdToEntryAndPicksMap: entryIdToEntryAndPicksMapType,
) => {
  const updatePicks: WinStreakUpdatePickObject[] = [];
  const updateEntries: WinStreakUpdateEntryObject[] = [];

  for (const entryId in entryIdToEntryAndPicksMap) {
    const {
      entry,
      picks,
    } = entryIdToEntryAndPicksMap[parseInt(entryId)];

    if (entry) {
      updateEntries.push(entry);
    }

    if (picks.length > 0) {
      updatePicks.push(...picks);
    }
  }

  return { updatePicks, updateEntries };
};

const processCompletedGames = async (
  completedGameIds: number[],
  supabase: SupabaseClient,
) => {
  const { gameIdToWinningTeamIdMap, updateGames } =
    await retrieveCompletedGamesAndParseWinners(completedGameIds, supabase);

  const currentTimestamp = new Date().toISOString();

  const { entryIdToEntryAndPicksMap } =
    await retrievePicksAndBuildEntryToPicksMap(
      completedGameIds,
      gameIdToWinningTeamIdMap,
      currentTimestamp,
      supabase,
    );

  await retrieveEntriesAndUpdateStreaks(
    entryIdToEntryAndPicksMap,
    currentTimestamp,
    supabase,
  );

  const { updatePicks, updateEntries } = extractPicksAndEntriesFromMap(
    entryIdToEntryAndPicksMap,
  );

  const { error } = await supabase.rpc("update_games_picks_entries", {
    updategames: updateGames,
    updatepicks: updatePicks,
    updateentries: updateEntries,
  });

  console.log({
    updateGames,
    updatePicks,
    updateEntries,
    error,
  });
};
// END UTIL FUNCTIONS
//-----------------------------------------------------------------

Deno.serve(async (req: Request) => {
  const { completedGameIds } = await req.json();

  if (!supabase) {
    return new Response("Supabase client not initialized", { status: 500 });
  }

  const response = new Response(
    JSON.stringify({
      status: "Accepted",
      message:
        "Completed game ID's received. Processing updates to related picks and entries.",
    }),
    { status: 202 },
  );

  EdgeRuntime.waitUntil(processCompletedGames(completedGameIds, supabase));

  return response;
});
