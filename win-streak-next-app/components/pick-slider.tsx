"use client";

import { useState } from "react";

const PickSlider = ({
  gameId,
  homeTeam,
  awayTeam,
  //onPickChange,
}: {
  gameId: number;
  homeTeam: string;
  awayTeam: string;
  //onPickChange: (gameId: string, team: string) => void;
}) => {
  const [pick, setPick] = useState<"home" | "away" | null>(null);
  const [gradient, setGradient] = useState<string>(
    "bg-gradient-to-r from-gray-400 via-gray-400 to-gray-400"
  ); // Default gradient - setup default to be whatever is in the db if it exists - also colors to team colors - also instead of team name, team logo
  const [homeTeamAnimation, setHomeTeamAnimation] =
    useState<string>("animation-none");
  const [awayTeamAnimation, setAwayTeamAnimation] =
    useState<string>("animation-none");
  // For animations, don't pulse until user selects - imported picks from db shouldn't pulse

  const handlePick = (direction: "home" | "away" | null) => {
    setPick(direction);
    //onPickChange(gameId, direction);
  };

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const sliderWidth = e.currentTarget.offsetWidth;
    const clickPosition =
      e.clientX - e.currentTarget.getBoundingClientRect().left;

    // Calculate the click position as a percentage of the width
    const clickPercentage = (clickPosition / sliderWidth) * 100;

    if (clickPercentage < 33) {
      setGradient("bg-gradient-to-r from-green-600 via-gray-400 to-gray-400");
      setHomeTeamAnimation("animate-pulse");
      setAwayTeamAnimation("animate-none");
      handlePick("away");
    } else if (clickPercentage > 66) {
      setGradient("bg-gradient-to-r from-gray-400 via-gray-400 to-yellow-400");
      setHomeTeamAnimation("animate-none");
      setAwayTeamAnimation("animate-pulse");
      handlePick("home");
    } else {
      setGradient("bg-gradient-to-r from-gray-400 via-gray-400 to-gray-400");
      setHomeTeamAnimation("animate-none");
      setAwayTeamAnimation("animate-none");
      handlePick(null);
    }
  };

  return (
    <div
      className={`flex items-center justify-center space-x-4 min-w-[350px] rounded-sm stroke-black ${gradient}`}
      onClick={handleSliderClick}
    >
      <div className="relative w-full h-12 cursor-pointer">
        {/* Home Team Label */}
        <div
          className={`absolute left-4 top-0 bottom-0 flex items-center justify-start w-1/2 text-sm font-semibold text-primary-foreground z-10 ${homeTeamAnimation}`}
        >
          {"homeTeam"}
        </div>
        {/* Game Start Details */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-primary-foreground z-10`}
        >
          {"7:00 PM EST"}
        </div>
        {/* Away Team Label */}
        <div
          className={`absolute right-4 top-0 bottom-0 flex items-center justify-end w-1/2 text-sm font-semibold text-primary-foreground z-10 ${awayTeamAnimation}`}
        >
          {"awayTeam"}
        </div>
      </div>
    </div>
  );
};

export { PickSlider };
