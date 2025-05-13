"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import ButtonNav from "@/components/button-nav";
import Leaderboard from "./leaderboard";
import { AllContestGamesPicksEntries, Contest, Entry, Pick } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { useMemo } from "react";
import StreakGraveyard from "./streak-graveyard";
import MyPicksDisplay from "@/components/my-picks-display";
import Rules from "./rules";
import WinnerDisplay from "./winner-display";

export default function CompletedContestView({
  contestData,
  user,
}: {
  contestData: AllContestGamesPicksEntries;
  user: User;
}) {
  const [currentView, setCurrentView] = useState<string>("home");

  // Pull in the user's most recent entry in that contest
  // Option 1: User had an active entry when the contest ended, not the winner
  // Option 2: User's last entry had an incorrect pick and ended
  // Option 3: User's entry was the winner
  // Option 4: There was no winning entry.
  // Option 5: User never entered the contest
  const contest: Contest = contestData.contest_details!;

  const allUserEntries = contestData.user_entries || [];
  const mostRecentEntry: Entry | null =
    allUserEntries.length > 0 &&
    !allUserEntries[0].entry_details.first_incorrect_pick_id
      ? allUserEntries[0].entry_details
      : null;

  const leaderboardEntries = contestData.leaderboard_entries || [];
  const winningEntries: Entry[] = leaderboardEntries.filter(
    (entry) => entry.is_winner
  );

  const failedEntries = allUserEntries.filter(
    (entry) => entry.entry_details.is_winner === false
  );

  const existingPicks: Pick[] | null = mostRecentEntry
    ? allUserEntries[0].entry_picks || []
    : null;

  const contestDetailsFilters = [
    { filter: "home", title: "Home" },
    { filter: "rules", title: "Rules" },
    { filter: "leaderboard", title: "Leaderboard" },
    { filter: "my-picks", title: "My Picks" },
    { filter: "past-entries", title: "🪦 Streak Graveyard 🪦" },
  ];
  return (
    <div className="w-full max-w-sm mx-auto">
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
                  <WinnerDisplay winningEntries={winningEntries} user={user} />
                </div>
                <div className="items-left">
                  <Leaderboard
                    numEntries={10}
                    entries={leaderboardEntries.filter(
                      (entry) => !entry.first_incorrect_pick_id
                    )}
                    setCurrentView={setCurrentView}
                    userId={user.id}
                  />
                </div>
              </>
            );
          case "rules":
            return <Rules />;
          case "leaderboard":
            return (
              <div className="w-full">
                <Leaderboard
                  entries={leaderboardEntries.filter(
                    (entry) => !entry.first_incorrect_pick_id
                  )}
                  userId={user.id}
                />
              </div>
            );
          case "my-picks":
            return (
              <div className="w-full flex flex-col h-full items-center justify-center">
                <MyPicksDisplay picks={existingPicks || []} />
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
    </div>
  );
}
