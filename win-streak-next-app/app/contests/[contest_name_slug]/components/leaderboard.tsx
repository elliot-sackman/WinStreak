"use client";

import { Entry } from "@/lib/types";

interface LeaderboardProps {
  numEntries?: number;
  entries: Entry[];
}

export default function Leaderboard({ numEntries, entries }: LeaderboardProps) {
  return (
    <>
      <div className="border border-input bg-gray-600 text-white rounded-sm w-full h-12 content-center">
        Leaderboard
      </div>
      {entries?.map((entry: Entry, index: number) => {
        if (numEntries && index >= numEntries) {
          return;
        }

        return (
          <div className="my-2 text-left" key={index}>
            {index + ". " + entry.display_name + " " + entry.current_streak}
          </div>
        );
      })}
    </>
  );
}
