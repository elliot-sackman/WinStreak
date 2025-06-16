"use client";

import {
  CarouselWithDots as Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ContestCarouselCard from "@/components/contest-carousel-card";
import ContestEntryDashboardCard from "@/components/contest-entry-dashboard-preview";
import { Contest, Entry } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";

export default function DashboardView({
  contests,
  user,
  entries,
}: {
  contests: Contest[];
  user: User;
  entries: Entry[];
}) {
  // Get all of the active contest entries
  const contestEntries: { [contestId: number]: Entry | null } = {};
  entries.forEach((entry: Entry) => (contestEntries[entry.contest_id] = entry));

  return (
    <div className="flex flex-col justify-center items-start">
      {Object.keys(contestEntries).length > 0 ? (
        <>
          <div className="text-xl text-left mb-4">My Contests</div>
          {contests.map((contest: Contest) => {
            if (
              contest.contest_id in contestEntries &&
              contestEntries[contest.contest_id]
            ) {
              return (
                <ContestEntryDashboardCard
                  key={"contest-entry-" + contest.contest_id}
                  contest={contest}
                  entry={contestEntries[contest.contest_id]!}
                  user={user}
                />
              );
            }
          })}
        </>
      ) : (
        <div>No active entries. Enter a contest!</div>
      )}
      <Separator className="my-6" />
      <div className="text-xl mb-4">Featured Contests</div>
      <Carousel
        className="w-full max-w-sm"
        plugins={[Autoplay({ delay: 6000 })]}
      >
        <CarouselContent>
          {contests.map((contest: Contest) => {
            if (contest.contest_id in contestEntries) {
              return (
                <CarouselItem key={"active-contests-" + contest.contest_id}>
                  <ContestCarouselCard
                    contest={contest}
                    entry={contestEntries[contest.contest_id]}
                    user={user}
                  />
                </CarouselItem>
              );
            } else {
              return (
                <CarouselItem key={"active-contests-" + contest.contest_id}>
                  <ContestCarouselCard contest={contest} user={user} />
                </CarouselItem>
              );
            }
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
