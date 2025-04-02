import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js";
import {
  potentialWinningEntryObject,
  WinStreakUpdateContestObject,
  WinStreakUpdateEntryObject,
} from "../_shared/types.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
  : null;

//-----------------------------------------------------------------
// UTIL FUNCTIONS - MAY BE MOVED TO A NEW LOCATION FOR READABILITY
const createContestToPotentialWinningEntriesMap = (
  potentialWinningEntries: potentialWinningEntryObject[],
) => {
  const contestToPotentialWinningEntriesMap: {
    [key: number]: potentialWinningEntryObject[];
  } = {};

  potentialWinningEntries.forEach((entry) => {
    const contestId = entry.contest_id;
    if (!contestToPotentialWinningEntriesMap[contestId]) {
      contestToPotentialWinningEntriesMap[contestId] = [];
    }
    contestToPotentialWinningEntriesMap[contestId].push(entry);
  });

  return contestToPotentialWinningEntriesMap;
};

const validateEntryStreak = async (
  entry: potentialWinningEntryObject,
  supabase: SupabaseClient,
) => {
  const { data: picks, error } = await supabase.from("picks")
    .select(
      "pick_id, game_start_time, pick_status",
    )
    .eq("entry_id", entry.entry_id)
    .order("game_start_time", {
      ascending: false,
    });

  // If there was a miscount of picks, we need to reset the streak to the correct number
  let calculatedStreak = 0;
  let isValid = true;

  // If there was an incorrect pick, then we need to end this streak
  let isComplete = false;

  picks?.forEach((pick) => {
    if (pick.pick_status === "correct") {
      calculatedStreak++;
    } else {
      isValid = false;
      isComplete = true;
    }
  });

  if (calculatedStreak < entry.current_streak || !picks) {
    isValid = false;
  }

  return {
    isValid,
    latestGameStartTime: picks && picks.length > 0
      ? new Date(picks[0].game_start_time).getTime()
      : null,
    calculatedStreak,
    isComplete,
  };
};

const parseAndValidatePotentialWinningEntries = async (
  contestToPotentialWinningEntriesMap: {
    [key: number]: potentialWinningEntryObject[];
  },
  supabase: SupabaseClient,
) => {
  const updateContests: WinStreakUpdateContestObject[] = [];
  const updateEntries: WinStreakUpdateEntryObject[] = [];

  for (const contestId of Object.keys(contestToPotentialWinningEntriesMap)) {
    const entries = contestToPotentialWinningEntriesMap[parseInt(contestId)];

    const winningEntries: potentialWinningEntryObject[] = [];

    // Set this originally to some date far in the future so that any game start time is earlier
    let latestGameStartTime = new Date("2100-01-01T00:00:00Z").getTime();

    for (const entry of entries) {
      const {
        isValid,
        latestGameStartTime: currentLatestGameStartTime,
        calculatedStreak,
        isComplete,
      } = await validateEntryStreak(
        entry,
        supabase,
      );

      if (
        isValid && currentLatestGameStartTime &&
        currentLatestGameStartTime < latestGameStartTime
      ) {
        // If the latest game start time is earlier than what's currently stored, overwrite it and reset winners
        latestGameStartTime = currentLatestGameStartTime;
        while (winningEntries.length > 0) {
          const losingEntry = winningEntries.pop();
          if (losingEntry) {
            updateEntries.push({
              entry_id: losingEntry.entry_id,
              current_streak: losingEntry.current_streak,
              is_complete: true,
              is_winner: false,
              entry_completion_datetime: new Date().toISOString(),
            });
          }
        }

        winningEntries.push(entry);
      } else if (
        isValid && currentLatestGameStartTime &&
        currentLatestGameStartTime === latestGameStartTime
      ) {
        // If it's the same, we have a tie, so we add it to the winningEntries array.
        winningEntries.push(entry);
      } else {
        // It's a loser, then we push its update object onto the updateEntries array
        updateEntries.push({
          entry_id: entry.entry_id,
          current_streak: isValid ? entry.current_streak : calculatedStreak,
          is_complete: isComplete,
          is_winner: false,
          entry_completion_datetime: isComplete
            ? new Date().toISOString()
            : undefined,
        });
      }
    }
    // If there are no winning entries, we don't need to update the contest
    if (winningEntries.length > 0) {
      // Push the contest update onto the array
      updateContests.push({
        contest_id: parseInt(contestId),
        contest_winning_entry_ids_array: winningEntries.map((entry) =>
          entry.entry_id
        ),
        contest_status: "ended",
        contest_end_datetime: new Date().toISOString(),
      });

      // Push the winning entries updates onto their array
      winningEntries.forEach((entry) => {
        updateEntries.push({
          entry_id: entry.entry_id,
          current_streak: entry.current_streak,
          is_complete: true,
          is_winner: true,
          entry_completion_datetime: new Date().toISOString(),
        });
      });
    }
  }

  return { updateContests, updateEntries };
};
// END UTIL FUNCTIONS
//-----------------------------------------------------------------

Deno.serve(async (_req: Request) => {
  if (!supabase) {
    return new Response("Supabase client not initialized", { status: 500 });
  }

  const { data, error } = await supabase
    .rpc("get_potential_winning_entries");

  // Type cast the data to the imported type
  const potentialWinningEntries = data as potentialWinningEntryObject[];
  const contestToPotentialWinningEntriesMap =
    createContestToPotentialWinningEntriesMap(potentialWinningEntries);

  if (error) {
    console.error("Error fetching potential winning entries:", error);
    return new Response("Error fetching potential winning entries", {
      status: 500,
    });
  }

  const { updateContests, updateEntries } =
    await parseAndValidatePotentialWinningEntries(
      contestToPotentialWinningEntriesMap,
      supabase,
    );

  if (updateContests.length > 0 || updateEntries.length > 0) {
    const { error: rpcError } = await supabase.rpc(
      "update_contests_and_entries",
      {
        updatecontests: updateContests,
        updateentries: updateEntries,
      },
    );
    if (rpcError) {
      console.error("Error updating contests and entries:", rpcError);
      return new Response("Error updating contests and entries", {
        status: 500,
      });
    }
  } else {
    console.log("No contests or entries to update.");
    return new Response("No contests or entries to update.", {
      status: 200,
    });
  }

  console.log({ updateContests, updateEntries });
  return new Response(
    JSON.stringify({
      updateContests,
      updateEntries,
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  );
});
