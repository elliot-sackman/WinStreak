"use client";

import { useState } from "react";
import { EnterContestButton } from "@/components/enter-contest-button";
import { PickMaker } from "@/components/pick-maker";
import { Separator } from "@/components/ui/separator";
import ButtonNav from "@/components/button-nav";
import Leaderboard from "./leaderboard";
import MyPicksDisplay from "@/components/my-picks-display";
import { Contest, Entry, Game, Pick, existingPicksObject } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { useMemo } from "react";
import streakTombstone from "@/app/static-images/streak-tombstone.png";
import Image from "next/image";
import StreakGraveyard from "./streak-graveyard";

export default function CompletedContestView({
  contest,
  allUserEntries,
  leaderboardEntries,
  existingPicks,
  user,
}: {
  contest: Contest;
  allUserEntries: Entry[];
  leaderboardEntries: Entry[];
  existingPicks: Pick[] | [];
  user: User;
}) {
  const [currentView, setCurrentView] = useState<string>("home");

  // Pull in the user's most recent entry in that contest
  // Option 1: User had an active entry when the contest ended, not the winner
  // Option 2: User's last entry had an incorrect pick and ended
  // Option 3: User's entry was the winner
  const mostRecentEntry: Entry | null =
    allUserEntries.length > 0 ? allUserEntries[0] : null;

  const winningEntries: Entry[] = leaderboardEntries.filter(
    (entry) => entry.is_winner
  );

  const winningDisplayNames = winningEntries
    .map((entry) => entry.display_name)
    .join(", ");

  const failedEntries = allUserEntries.filter((entry) => !entry.is_winner);

  const contestDetailsFilters = [
    { filter: "home", title: "Home" },
    { filter: "rules", title: "Rules" },
    { filter: "leaderboard", title: "Leaderboard" },
    { filter: "my-picks", title: "My Picks" },
    { filter: "past-entries", title: "🪦 Streak Graveyard 🪦" },
  ];
  const existingPicksObject: existingPicksObject = {};

  existingPicks?.forEach((pick: Pick) => {
    existingPicksObject[pick.game_id] = {
      teamId: pick.value,
      pickId: pick.pick_id,
    };
  });

  return (
    <div className="w-full max-w-sm">
      <ButtonNav
        filters={contestDetailsFilters}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <Separator className="my-4" />
      <div>{winningDisplayNames} won this contest.</div>
      {useMemo(() => {
        switch (currentView) {
          case "home":
            return (
              <>
                <div className="w-full flex flex-col h-full items-center max-w-sm">
                  <div className="border border-input bg-neutral-500 text-white rounded-xl w-full h-12 content-center">
                    Contest Overview
                  </div>
                  <p className="my-6">{contest.contest_description}</p>
                </div>
                <div className="items-left">
                  <Leaderboard
                    numEntries={10}
                    entries={leaderboardEntries.filter(
                      (entry) => !entry.first_incorrect_pick_id
                    )}
                    userId={user.id}
                  />
                </div>
              </>
            );
          case "rules":
            return (
              <div className="w-full max-w-sm">
                <div className="border border-input bg-neutral-500 text-white rounded-xl w-full h-12 content-center">
                  Rules
                </div>
                <p className="my-6 text-left">
                  <strong>General:</strong> Pick {contest.league_abbreviation}{" "}
                  teams to win their games. If a team loses you're eliminated!
                </p>
                <p className="my-6 text-left">
                  <strong>Race To:</strong> {contest.streak_length} wins.
                </p>
                <p className="my-6 text-left">
                  <strong>Prize:</strong> ${contest.contest_prize}.
                </p>
                <p className="my-6 text-left">
                  <strong>Reentries Allowed:</strong>{" "}
                  {contest.reentries_allowed ? "Yes" : "No"}.
                </p>
                <p className="my-6 text-left">
                  <strong>Contest Length:</strong>{" "}
                  {contest.contest_end_datetime
                    ? "Ends on: " +
                      new Date(contest.contest_end_datetime).toLocaleString()
                    : "Until someone wins."}
                </p>
              </div>
            );
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
              <div className="w-full flex flex-col h-full items-center justify-center"></div>
            );
          case "past-entries":
            return (
              <>
                {failedEntries.length > 0 ? (
                  <StreakGraveyard
                    previousEntries={failedEntries}
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
