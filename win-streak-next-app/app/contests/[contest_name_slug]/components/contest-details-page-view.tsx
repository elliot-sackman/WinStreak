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

export default function ContestDetailsPageView({
  contest,
  activeEntry,
  allUserEntries,
  leaderboardEntries,
  games,
  existingPicks,
  user,
}: {
  contest: Contest;
  activeEntry: Entry | null;
  allUserEntries: Entry[];
  leaderboardEntries: Entry[];
  games: Game[];
  existingPicks: Pick[] | [];
  user: User;
}) {
  const [currentView, setCurrentView] = useState<string>("home");

  const lastUnsuccessfulEntry: Entry | null =
    allUserEntries.length > 0 && !activeEntry ? allUserEntries[0] : null;

  const failedEntries: Entry[] =
    allUserEntries.length > 0
      ? allUserEntries.filter(
          (entry) =>
            entry.is_complete === true &&
            entry.current_streak < entry.contest_streak_length
        )
      : [];

  const contestDetailsFilters = [
    { filter: "home", title: "Home" },
    { filter: "rules", title: "Rules" },
    { filter: "leaderboard", title: "Leaderboard" },
    { filter: "make-picks", title: "Make Picks" },
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
      {useMemo(() => {
        switch (currentView) {
          case "home":
            return (
              <>
                <div className="w-full flex flex-col h-full items-center max-w-sm">
                  {activeEntry ? (
                    <>
                      <div className="border border-input bg-neutral-500 text-white rounded-xl w-full h-12 content-center">
                        Current Streak
                      </div>
                      <div className="w-24 h-24 my-4 rounded-full bg-gray-200 border-2 border-gray-300 shadow-lg flex items-center justify-center text-5xl text-black">
                        {activeEntry.current_streak}
                      </div>
                    </>
                  ) : (
                    lastUnsuccessfulEntry && (
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
                    )
                  )}

                  <div className="border border-input bg-neutral-500 text-white rounded-xl w-full h-12 content-center">
                    Contest Overview
                  </div>
                  <p className="my-6">{contest.contest_description}</p>
                </div>
                <div className="items-left">
                  <Leaderboard
                    numEntries={10}
                    entries={leaderboardEntries}
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
                <Leaderboard entries={leaderboardEntries} userId={user.id} />
              </div>
            );
          case "make-picks":
            return (
              <div className="w-full max-w-sm">
                {activeEntry ? (
                  <PickMaker
                    games={games}
                    entry={activeEntry}
                    existingPicks={existingPicksObject || {}}
                  />
                ) : (
                  <div className="my-6">
                    Enter the contest to start making picks!
                  </div>
                )}
              </div>
            );
          case "my-picks":
            return (
              <div className="w-full flex flex-col h-full items-center justify-center">
                {activeEntry ? (
                  <>
                    <div className="border border-input bg-neutral-500 text-white rounded-xl w-full h-12 content-center">
                      Current Streak
                    </div>
                    <div className="w-24 h-24 my-4 rounded-full bg-gray-200 border-2 border-gray-300 shadow-lg flex items-center justify-center text-5xl text-black">
                      {activeEntry?.current_streak}
                    </div>

                    <MyPicksDisplay picks={existingPicks || []} />
                  </>
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

      {!activeEntry &&
        new Date() > new Date(contest.contest_start_datetime) && (
          <div className="sticky inset-x-0 bottom-0 bg-transparent w-full z-10">
            <EnterContestButton contest={contest} userId={user.id} />
          </div>
        )}
    </div>
  );
}
