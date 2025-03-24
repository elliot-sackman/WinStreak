"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Contest, Entry } from "@/lib/types";
import streakTombstone from "@/app/static-images/streak-tombstone.png";

interface PastEntryCardProps {
  entry: Entry;
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
            RIP <br></br>Here Lies Your Streak of {entry.current_streak} Games.
          </p>
        </div>
        Your streak was tragically ended{" "}
        {entry.entry_completion_datetime
          ? "on " +
            new Date(entry.entry_completion_datetime).toLocaleDateString()
          : ""}{" "}
        {entry.first_incorrect_pick_losing_team_full_name
          ? "by the " + entry.first_incorrect_pick_losing_team_full_name + "."
          : "."}
      </CardContent>
    </Card>
  );
}
