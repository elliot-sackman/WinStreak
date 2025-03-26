"use client";

import { Card } from "@/components/ui/card";
import { Entry } from "@/lib/types";

interface LeaderboardProps {
  numEntries?: number;
  entries: Entry[];
  userId: string;
}

export default function Leaderboard({
  numEntries,
  entries,
  userId,
}: LeaderboardProps) {
  return (
    <>
      <div className="border border-input bg-neutral-500 text-white rounded-xl w-full max-w-sm h-12 content-center">
        Leaderboard
      </div>
      {entries.length > 0 ? (
        entries?.map((entry: Entry, index: number) => {
          if (numEntries && index >= numEntries) {
            return;
          }

          return (
            <div
              className={`my-2 flex text-left gap-x-4 items-center p-2 rounded-xl w-full max-w-sm ${userId === entry.user_id ? "bg-green-500" : ""}`}
              key={index}
            >
              <div className="text-2xl sm:text-3xl w-10">{index + 1 + "."}</div>
              <div className="text-2xl sm:text-3xl flex-1">
                {entry.display_name}
              </div>
              <Card className="text-2xl sm:text-3xl flex rounded-full bg-gray-200 w-12 h-12 items-center justify-center text-black">
                {entry.current_streak}
              </Card>
            </div>
          );
        })
      ) : (
        <div className="my-6">Be the first one to build a streak!</div>
      )}
    </>
  );
}
