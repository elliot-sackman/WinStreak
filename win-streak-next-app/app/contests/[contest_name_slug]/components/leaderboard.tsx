"use client";

import { Card } from "@/components/ui/card";
import { Entry, Pick } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { SetStateAction, Dispatch, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MyPicksDisplay from "@/components/my-picks-display";
import { createClient } from "@/utils/supabase/client";

interface LeaderboardProps {
  numEntries?: number;
  entries: Entry[];
  setCurrentView?: Dispatch<SetStateAction<string>>;
  userId: string;
}

interface RankedEntry extends Entry {
  rank: number;
}

export default function Leaderboard({
  numEntries,
  entries,
  setCurrentView,
  userId,
}: LeaderboardProps) {
  // Calculate ranks, accounting for ties
  const rankedEntries: RankedEntry[] = [];

  // Calculate ranks manually using a for loop
  for (let i = 0; i < entries.length; i++) {
    const currentEntry = entries[i];
    const previousEntry = i > 0 ? rankedEntries[i - 1] : null;

    // Determine the rank
    const rank =
      previousEntry &&
      previousEntry.current_streak === currentEntry.current_streak
        ? previousEntry.rank // Use the previous entry's rank if streaks are equal
        : i + 1; // Otherwise, assign the current index + 1 as the rank

    // Push the ranked entry into the array
    rankedEntries.push({ ...currentEntry, rank });
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogPicks, setDialogPicks] = useState<Pick[]>([]);
  const [dialogEntry, setDialogEntry] = useState<RankedEntry | null>(null);

  async function handleStreakClick(entry: RankedEntry) {
    setDialogEntry(entry);
    setDialogOpen(true);
    setLoading(true);
    setDialogPicks([]);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("picks")
      .select("*")
      .eq("entry_id", entry.entry_id)
      .in("pick_status", ["correct", "incorrect"])
      .order("game_start_time", { ascending: false });
    if (!error && data) {
      setDialogPicks(data);
    }
    setLoading(false);
  }

  return (
    <>
      {numEntries && setCurrentView ? (
        <div className="flex flex-row justify-between items-center mb-2">
          <div className="text-3xl text-left text-white rounded-xl w-full max-w-sm h-12 content-center">
            Leaderboard
          </div>
          <Button
            variant="enter"
            className="h-8"
            onClick={() => {
              setCurrentView("leaderboard");
            }}
          >
            SEE ALL
          </Button>
        </div>
      ) : (
        <div className="text-3xl text-left text-white rounded-xl w-full max-w-sm h-12 content-center">
          Leaderboard
        </div>
      )}

      <div className="flex-grow h-[1px] rounded-r-full bg-gradient-to-r from-neutral-800 to-green-800"></div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-sm max-h-[75%] overflow-y-auto"
          aria-describedby="streak-summary-dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {dialogEntry
                ? `${dialogEntry.display_name}'s WinStreak: 🔥${dialogEntry.current_streak}`
                : "Completed Picks"}
            </DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              Loading...
            </div>
          ) : dialogPicks.length > 0 ? (
            <MyPicksDisplay picks={dialogPicks} />
          ) : (
            <div className="flex justify-center items-center h-32">
              This user has not completed any picks yet.
            </div>
          )}
        </DialogContent>
      </Dialog>
      {rankedEntries.length > 0 ? (
        rankedEntries.map((entry, index) => {
          if (numEntries && index >= numEntries) {
            return;
          }

          return (
            <div key={index}>
              <div
                className={`flex text-left gap-x-4 items-center p-2 w-full max-w-sm ${userId === entry.user_id ? "bg-green-600" : ""}`}
                key={index}
              >
                <div className="text-xl sm:text-3xl w-10">
                  {entry.rank + "."}
                </div>
                <div className="text-xl sm:text-3xl flex-1">
                  {entry.display_name}
                </div>
                <Card
                  className="text-xl sm:text-3xl flex rounded-full bg-gray-200 w-8 h-8 items-center justify-center text-black cursor-pointer"
                  onClick={() => handleStreakClick(entry)}
                  title="View completed picks"
                >
                  {entry.current_streak}
                </Card>
              </div>
              <div className="flex-grow h-[1px] rounded-r-full bg-gradient-to-r from-neutral-800 to-green-800"></div>
            </div>
          );
        })
      ) : (
        <div className="my-6">Be the first one to build a streak!</div>
      )}
    </>
  );
}
