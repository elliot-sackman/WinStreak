"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Entry, Contest } from "@/lib/types";
import FailedEntryCard from "./failed-entry-card";

interface StreakGraveyardProps {
  previousEntries: Entry[];
  contest: Contest;
}

export default function StreakGraveyard({
  previousEntries,
  contest,
}: StreakGraveyardProps) {
  return (
    <div>
      <div className="border border-input bg-neutral-500 text-white rounded-xl w-full max-w-sm h-12 content-center">
        Your Failed Streaks
      </div>
      <Carousel className="w-full max-w-sm">
        <CarouselContent>
          {previousEntries.map((entry) => {
            return (
              <CarouselItem key={"past-entries-" + entry.entry_id}>
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
