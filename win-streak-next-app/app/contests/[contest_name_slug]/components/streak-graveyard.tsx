"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Entry, Contest, Pick } from "@/lib/types";
import FailedEntryCard from "./failed-entry-card";

interface StreakGraveyardProps {
  failedEntries: { entry_details: Entry; entry_picks: Pick[] | null }[];
  contest: Contest;
}

export default function StreakGraveyard({
  failedEntries,
  contest,
}: StreakGraveyardProps) {
  return (
    <div>
      <Carousel className="w-full max-w-sm">
        <CarouselContent>
          {failedEntries.map((entry) => {
            return (
              <CarouselItem
                key={"past-entries-" + entry.entry_details.entry_id}
              >
                <FailedEntryCard entry={entry} contest={contest} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
