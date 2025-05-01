"use client";

import { useState } from "react";
import { EnterContestButton } from "@/components/enter-contest-button";
import { PickMaker } from "@/components/pick-maker";
import { Separator } from "@/components/ui/separator";
import ButtonNav from "@/components/button-nav";
import Leaderboard from "./leaderboard";
import MyPicksDisplay from "@/components/my-picks-display";
import {
  AllContestGamesPicksEntries,
  existingPicksObject,
  Entry,
  Pick,
  Contest,
  Game,
} from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { useMemo } from "react";
import streakTombstone from "@/app/static-images/streak-tombstone.png";
import Image from "next/image";
import StreakGraveyard from "./streak-graveyard";

export default function ContestDetailsPageView({
  contestData,
  user,
}: {
  contestData: AllContestGamesPicksEntries;
  user: User;
}) {
  const [currentView, setCurrentView] = useState<string>("home");

  // destructure contestData object and assing to vars
  // Update streak graveyard to show my-picks-display in card
  const contest: Contest = contestData.contest_details!;

  const games: Game[] = contestData.games || [];

  const allUserEntries = contestData.user_entries || [];

  const activeEntry: Entry | null =
    allUserEntries.length > 0 &&
    allUserEntries[0].entry_details.is_complete === false
      ? allUserEntries[0].entry_details
      : null;

  const lastUnsuccessfulEntry: Entry | null =
    allUserEntries.length > 0 &&
    !activeEntry &&
    !allUserEntries[0].entry_details.is_winner
      ? allUserEntries[0].entry_details
      : null;

  const failedEntries = allUserEntries.filter(
    (entry) => entry.entry_details.is_winner === false
  );

  const existingPicks: Pick[] | null = activeEntry
    ? allUserEntries[0].entry_picks || []
    : null;
  const existingPicksObject: existingPicksObject = {};

  existingPicks?.forEach((pick: Pick) => {
    existingPicksObject[pick.game_id] = {
      teamId: pick.value,
      pickId: pick.pick_id,
    };
  });

  const leaderboardEntries = contestData.leaderboard_entries || [];

  const contestDetailsFilters = [
    { filter: "home", title: "Home" },
    { filter: "rules", title: "Rules" },
    { filter: "make-picks", title: "Make Picks" },
    { filter: "my-picks", title: "My Picks" },
    { filter: "past-entries", title: "🪦 Streak Graveyard 🪦" },
    { filter: "leaderboard", title: "Leaderboard" },
  ];
  return (
    <div className="w-full max-w-sm justify-center">
      <ButtonNav
        filters={contestDetailsFilters}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <Separator className="my-4" />
      {useMemo(() => {
        switch (currentView) {
          case "home":
            return (
              <>
                <div className="w-full flex flex-col h-full items-center max-w-sm">
                  {lastUnsuccessfulEntry && (
                    <>
                      <div className="relative mt-2 mb-4 flex items-center justify-center">
                        {/* Tombstone Image */}
                        <Image
                          src={streakTombstone}
                          alt="streak tombstone"
                          className="w-[250px]"
                        />
                        {/* Overlayed Text */}
                        <p className="absolute text-center text-black text-lg font-bold drop-shadow-md max-w-[125px] mb-10">
                          RIP <br></br>Here Lies Your Streak of{" "}
                          {lastUnsuccessfulEntry.current_streak} Games.
                        </p>
                      </div>
                      <div className="my-2">
                        Looks like your streak was tragically ended by the{" "}
                        {
                          lastUnsuccessfulEntry.first_incorrect_pick_losing_team_full_name
                        }
                        . Re-enter now to start a new streak!
                      </div>
                    </>
                  )}

                  <p className="mb-4">{contest.contest_description}</p>
                </div>
                <div className="items-left">
                  <Leaderboard
                    numEntries={10}
                    entries={leaderboardEntries}
                    setCurrentView={setCurrentView}
                    userId={user.id}
                  />
                </div>
              </>
            );
          case "rules":
            return (
              <div className="w-full max-w-sm">
                <p className="my-6 text-left">
                  <strong>
                    The rules are simple: pick teams to win their games!
                  </strong>
                </p>
                <ul className="mx-2 text-left text-sm">
                  <li className="my-4">
                    • You can make as many (or as few) picks as you want each
                    day
                  </li>
                  <li className="my-4">
                    • Each correct pick increases your WinStreak by +1
                  </li>
                  <li className="my-4">
                    • An incorrect pick eliminates you from the contest, and all
                    pending picks will be cancelled
                  </li>
                  <li className="my-4">
                    • If you are eliminated, you can re-enter the contest at any
                    time
                  </li>
                  <li className="my-4">
                    • The first person to reach the target WinStreak wins the
                    prize
                  </li>
                  <li className="my-4">
                    • Tiebreaker will be the start time of the winning pick
                  </li>
                </ul>
              </div>
            );
          case "leaderboard":
            return (
              <div className="w-full">
                <Leaderboard entries={leaderboardEntries} userId={user.id} />
              </div>
            );
          case "make-picks":
            return (
              <div className="w-full max-w-sm">
                {activeEntry &&
                leaderboardEntries[0].current_streak !==
                  contest.streak_length ? (
                  <PickMaker
                    games={games}
                    entry={activeEntry}
                    existingPicks={existingPicksObject || {}}
                  />
                ) : !leaderboardEntries ||
                  leaderboardEntries.length === 0 ||
                  leaderboardEntries[0].current_streak !==
                    contest.streak_length ? (
                  <div className="my-6">
                    Enter the contest to start making picks!
                  </div>
                ) : (
                  <div className="my-6">
                    There is at least one streak that's reached the target,
                    making picks is disabled.
                  </div>
                )}
              </div>
            );
          case "my-picks":
            return (
              <div className="w-full flex flex-col h-full items-center justify-center">
                {activeEntry ? (
                  <MyPicksDisplay picks={existingPicks || []} />
                ) : (
                  <div className="my-6">
                    Enter the contest and make some picks!
                  </div>
                )}
              </div>
            );
          case "past-entries":
            return (
              <>
                {failedEntries.length > 0 ? (
                  <StreakGraveyard
                    failedEntries={failedEntries}
                    contest={contest}
                  />
                ) : (
                  <div>No streaks lie here.</div>
                )}
              </>
            );
          default:
            return null;
        }
      }, [currentView, existingPicks])}

      {!activeEntry && contest.contest_status === "in_progress" && (
        <div className="sticky inset-x-0 bottom-0 bg-transparent w-full z-10">
          <EnterContestButton contest={contest} userId={user.id} />
        </div>
      )}
    </div>
  );
}
