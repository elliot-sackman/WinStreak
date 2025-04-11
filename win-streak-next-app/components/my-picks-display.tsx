"use client";

import { Pick } from "@/lib/types";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MyPicksDisplayProps {
  picks: Pick[];
}

export default function MyPicksDisplay({ picks }: MyPicksDisplayProps) {
  const pendingPicks = picks.filter((pick) => pick.pick_status === "pending");
  const correctPicks = picks.filter((pick) => pick.pick_status === "correct");
  const incorrectPicks = picks.filter(
    (pick) => pick.pick_status === "incorrect"
  );

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
    if (pick.home_team_id === pick.value) {
      var gradient = `linear-gradient(to right, #000000, #000000, ${pick.home_team_primary_hex_color || "green"}`;
    } else {
      gradient = `linear-gradient(to right, ${pick.away_team_primary_hex_color || "green"}, #000000, #000000`;
    }

    if (pick.pick_status === "correct") {
      var borderColor = "border-4 border-green-600";
      var overlayColor = "bg-green-600";
      var overlayIcon = "✔";
    } else if (pick.pick_status === "incorrect") {
      borderColor = "border-4 border-red-600";
      overlayColor = "bg-red-600";
      overlayIcon = "✘";
    } else {
      borderColor = "";
      overlayColor = "";
      overlayIcon = "";
    }

    return (
      <Card
        key={pick.pick_id}
        className={`my-2 relative ${borderColor}`}
        style={{ backgroundImage: gradient }}
      >
        {/* Overlay */}
        {pick.pick_status !== "pending" && (
          <div
            className={`absolute top-0 ${
              pick.home_team_id === pick.value
                ? "-right-[1px] clip-path-rightTriangle rounded-tr-sm"
                : "left-0 clip-path-leftTriangle rounded-tl-sm"
            } w-12 h-8 ${overlayColor}  flex items-top justify-center`}
          >
            <span
              className={`text-white text-sm font-semibold ${
                pick.home_team_id === pick.value
                  ? "translate-x-3"
                  : "-translate-x-3"
              }`}
            >
              {overlayIcon}
            </span>
          </div>
        )}

        <div className="flex items-center justify-center space-x-4 w-full max-w-sm">
          <div className="relative w-full h-16 cursor-pointer">
            {/* Away Team Label */}
            <div
              className={
                "absolute left-4 top-0 bottom-0 flex items-center justify-start w-1/2 text-sm font-semibold text-white z-10"
              }
            >
              {pick.away_team_nickname}
            </div>
            {/* Pick Start Details */}
            <div
              className={
                "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-white text-center z-10"
              }
            >
              {new Date(pick.game_start_time).toLocaleTimeString([], {
                timeStyle: "short",
              })}
              {new Date() > new Date(pick.game_start_time) && (
                <div>{pick.away_team_score + " - " + pick.home_team_score}</div>
              )}
            </div>
            {/* Home Team Label */}
            <div
              className={
                "absolute right-4 top-0 bottom-0 flex items-center justify-end w-1/2 text-sm font-semibold text-white z-10"
              }
            >
              {pick.home_team_nickname}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const pendingPicksByDate = getPicksByGameDate(pendingPicks);
  const correctPicksByGameDate = getPicksByGameDate(correctPicks);
  const incorrectPicksByGameDate = getPicksByGameDate(incorrectPicks);

  return (
    <Accordion type="multiple" className="w-full">
      {pendingPicks.length > 0 && (
        <AccordionItem value="pending">
          <AccordionTrigger className="relative flex items-center justify-end w-full max-w-sm h-8 text-xl rounded-sm my-4">
            <span className="absolute left-0">🔄 PENDING</span>
          </AccordionTrigger>
          <AccordionContent>
            {Object.keys(pendingPicksByDate).map((gameDate: string) => {
              return (
                <div key={"pending" + gameDate}>
                  <h2 key={"pending" + gameDate} className="text-left">
                    {gameDate}
                  </h2>
                  {pendingPicksByDate[gameDate].map((pick: Pick) => {
                    return displayPick(pick);
                  })}
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      )}

      {correctPicks.length > 0 && (
        <AccordionItem value="correct">
          <AccordionTrigger className="relative flex items-center justify-end space-x-4 w-full max-w-sm h-8 text-xl rounded-sm my-4">
            <span className="absolute left-0 transform">📈 WINS</span>
          </AccordionTrigger>
          <AccordionContent>
            {Object.keys(correctPicksByGameDate).map((gameDate: string) => {
              return (
                <div key={"completed" + gameDate}>
                  <h2 key={"completed" + gameDate} className="text-left">
                    {gameDate}
                  </h2>
                  {correctPicksByGameDate[gameDate].map((pick: Pick) => {
                    return displayPick(pick);
                  })}
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      )}

      {incorrectPicks.length > 0 && (
        <AccordionItem value="incorrect">
          <AccordionTrigger className="relative flex items-center justify-end space-x-4 w-full max-w-sm h-8 text-xl rounded-sm my-4">
            <span className="absolute left-0">❌ LOSSES</span>
          </AccordionTrigger>
          <AccordionContent>
            {Object.keys(incorrectPicksByGameDate).map((gameDate: string) => {
              return (
                <div key={"completed" + gameDate}>
                  <h2 key={"completed" + gameDate} className="text-left">
                    {gameDate}
                  </h2>
                  {incorrectPicksByGameDate[gameDate].map((pick: Pick) => {
                    return displayPick(pick);
                  })}
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
