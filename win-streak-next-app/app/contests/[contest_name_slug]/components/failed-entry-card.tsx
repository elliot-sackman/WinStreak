"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Contest, Entry, Pick } from "@/lib/types";
import streakTombstone from "@/app/static-images/streak-tombstone.png";
import MyPicksDisplay from "@/components/my-picks-display";

interface PastEntryCardProps {
  entry: { entry_details: Entry; entry_picks: Pick[] | null };
  contest: Contest;
}

export default function FailedEntryCard({
  entry,
  contest,
}: PastEntryCardProps) {
  return (
    <Card>
      <CardContent className="aspect-square content-center p-6 border-black border-2 rounded-lg">
        <h1 className="text-2xl font-semibold my-2">{contest.contest_name}</h1>
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
            {entry.entry_details.current_streak} Games.
          </p>
        </div>
        Your streak was tragically ended{" "}
        {entry.entry_details.entry_completion_datetime
          ? "on " +
            new Date(
              entry.entry_details.entry_completion_datetime
            ).toLocaleDateString()
          : ""}{" "}
        {entry.entry_details.first_incorrect_pick_losing_team_full_name
          ? "by the " +
            entry.entry_details.first_incorrect_pick_losing_team_full_name +
            "."
          : "."}
        <MyPicksDisplay picks={entry.entry_picks || []} />
      </CardContent>
    </Card>
  );
}
