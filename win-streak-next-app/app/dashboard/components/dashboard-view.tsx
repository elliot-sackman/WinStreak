"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ContestCarouselCard from "@/components/contest-carousel-card";
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
    <div className="flex flex-col justify-center items-center">
      Your Active Contests
      {entries.length > 0 ? (
        <Carousel className="w-3/4 max-w-sm">
          <CarouselContent>
            {contests.map((contest: Contest) => {
              if (contest.contest_id in contestEntries) {
                return (
                  <CarouselItem key={"my-contests-" + contest.contest_id}>
                    <ContestCarouselCard
                      contest={contest}
                      entry={contestEntries[contest.contest_id]}
                      user={user}
                    />
                  </CarouselItem>
                );
              }
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div>No active entries. Enter a contest!</div>
      )}
      <Separator className="my-6" />
      Live Contests
      <Carousel
        className="w-3/4 max-w-sm"
        plugins={[Autoplay({ delay: 6000 })]}
      >
        <CarouselContent>
          {contests.map((contest: Contest) => {
            if (contest.contest_id in contestEntries) {
              return (
                <CarouselItem key={"my-contests-" + contest.contest_id}>
                  <ContestCarouselCard
                    contest={contest}
                    entry={contestEntries[contest.contest_id]}
                    user={user}
                  />
                </CarouselItem>
              );
            } else {
              return (
                <CarouselItem key={"my-contests-" + contest.contest_id}>
                  <ContestCarouselCard contest={contest} user={user} />
                </CarouselItem>
              );
            }
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
