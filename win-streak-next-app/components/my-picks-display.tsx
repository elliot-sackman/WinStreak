"use client";

import { Pick } from "@/lib/types";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface MyPicksDisplayProps {
  picks: Pick[];
}

export default function MyPicksDisplay({ picks }: MyPicksDisplayProps) {
  const pendingPicks = picks.filter((pick) => pick.pick_status === "pending");
  const completedPicks = picks.filter((pick) => pick.pick_status === "correct");

  const getPicksByGameDate = function (picks: Pick[]) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const picksByGameDate: { [gameDate: string]: Pick[] } = {};
    picks.forEach((pick: Pick) => {
      let gameDate = new Date(pick.game_start_time).toLocaleDateString(
        undefined,
        options
      );
      if (!(gameDate in picksByGameDate)) {
        picksByGameDate[gameDate] = [];
      }

      picksByGameDate[gameDate].push(pick);
    });
    return picksByGameDate;
  };

  const displayPick = (pick: Pick) => {
    const leftColor =
      pick.away_team_id === pick.value ? "green-600" : "gray-600";
    const rightColor =
      pick.home_team_id === pick.value ? "green-600" : "gray-600";

    const gradient =
      "bg-gradient-to-r from-" +
      leftColor +
      " " +
      "via-gray-600 to-" +
      rightColor;

    return (
      <Card key={pick.pick_id} className={`my-2 ${gradient}`}>
        <div className="flex items-center justify-center space-x-4 min-w-[350px] rounded-sm">
          <div className="relative w-full h-16 cursor-pointer">
            {/* Away Team Label */}
            <div
              className={`absolute left-4 top-0 bottom-0 flex items-center justify-start w-1/2 text-sm font-semibold text-white z-10`}
            >
              {pick.away_team_nickname}
            </div>
            {/* Pick Start Details */}
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-white z-10`}
            >
              {new Date(pick.game_start_time).toLocaleTimeString()}
              {pick.pick_status === "correct" && (
                <div>{pick.away_team_score + " - " + pick.home_team_score}</div>
              )}
            </div>
            {/* Home Team Label */}
            <div
              className={`absolute right-4 top-0 bottom-0 flex items-center justify-end w-1/2 text-sm font-semibold text-white z-10`}
            >
              {pick.home_team_nickname}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const pendingPicksByDate = getPicksByGameDate(pendingPicks);
  const completedPicksByGameDate = getPicksByGameDate(completedPicks);

  return (
    <Accordion type="multiple" className="w-full">
      <div className="border border-input bg-gray-600 text-white rounded-sm w-full h-12 content-center">
        My Picks
      </div>
      <AccordionItem value="pending">
        <AccordionTrigger className="relative flex items-center justify-end min-w-[350px] h-8 text-xl rounded-sm my-4">
          <span className="absolute left-1/2 transform -translate-x-1/2">
            Pending Picks
          </span>
        </AccordionTrigger>
        <AccordionContent>
          {Object.keys(pendingPicksByDate).map((gameDate: string) => {
            return (
              <div key={"pending" + gameDate}>
                <h2 key={"pending" + gameDate}>{gameDate}</h2>
                {pendingPicksByDate[gameDate].map((pick: Pick) => {
                  return displayPick(pick);
                })}
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="completed">
        <AccordionTrigger className="relative flex items-center justify-end space-x-4 min-w-[350px] h-8 text-xl rounded-sm my-4">
          <span className="absolute left-1/2 transform -translate-x-1/2">
            Correct Picks
          </span>
        </AccordionTrigger>
        <AccordionContent>
          {Object.keys(completedPicksByGameDate).map((gameDate: string) => {
            return (
              <div key={"completed" + gameDate}>
                <h2 key={"completed" + gameDate}>{gameDate}</h2>
                {completedPicksByGameDate[gameDate].map((pick: Pick) => {
                  return displayPick(pick);
                })}
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
