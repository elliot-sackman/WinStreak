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

export default function ContestDetailsPageView({
  contest,
  activeEntry,
  leaderboardEntries,
  games,
  existingPicks,
  user,
}: {
  contest: Contest;
  activeEntry: Entry | null;
  leaderboardEntries: Entry[];
  games: Game[];
  existingPicks: Pick[] | [];
  user: User;
}) {
  const [currentView, setCurrentView] = useState<string>("home");

  const contestDetailsFilters = [
    {
      filter: "home",
      title: "Home",
    },
    {
      filter: "rules",
      title: "Rules",
    },
    {
      filter: "leaderboard",
      title: "Leaderboard",
    },
    {
      filter: "make-picks",
      title: "Make Picks",
    },
    {
      filter: "my-picks",
      title: "My Picks",
    },
  ];
  const existingPicksObject: existingPicksObject = {};

  existingPicks?.forEach((pick: Pick) => {
    existingPicksObject[pick.game_id] = {
      teamId: pick.value,
      pickId: pick.pick_id,
    };
  });
  return (
    <div>
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
                <div className="w-full flex flex-col h-full items-center max-w-[350px]">
                  {activeEntry && (
                    <>
                      <div className="border border-input bg-gray-600 text-white rounded-sm w-full h-12 content-center">
                        Current Streak
                      </div>
                      <div className="w-24 h-24 my-4 rounded-full bg-gray-200 border-2 border-gray-300 shadow-lg flex items-center justify-center text-5xl text-black">
                        {activeEntry?.current_streak}
                      </div>
                    </>
                  )}

                  <div className="border border-input bg-gray-600 text-white rounded-sm w-full h-12 content-center">
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
              <div className="w-full max-w-[350px]">
                <div className="border border-input bg-gray-600 text-white rounded-sm w-full h-12 content-center">
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
              <div>
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
                    <div className="border border-input bg-gray-600 text-white rounded-sm w-full h-12 content-center">
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
          default:
            return null;
        }
      }, [currentView])}

      {!activeEntry && (
        <div className="sticky inset-x-0 bottom-0 bg-transparent w-full z-10">
          <EnterContestButton contest={contest} userId={user.id} />
        </div>
      )}
    </div>
  );
}
