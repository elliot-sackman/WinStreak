"use client";

import { useState, useEffect } from "react";
import { Game } from "@/lib/types";
import { Card } from "@/components/ui/card";

const PickSlider = ({
  game,
  existingPick,
  handlePickChange,
}: {
  game: Game;
  existingPick: number | null;
  handlePickChange: Function;
}) => {
  const [pick, setPick] = useState<number | null>(existingPick);
  const [gradient, setGradient] = useState<string>(
    "bg-gradient-to-r from-gray-600 via-gray-600 to-gray-600"
  ); // Default gradient - setup default to be whatever is in the db if it exists - also colors to team colors - also instead of team name, team logo
  const [homeTeamAnimation, setHomeTeamAnimation] =
    useState<string>("animate-none");
  const [awayTeamAnimation, setAwayTeamAnimation] =
    useState<string>("animate-none");
  // For animations, don't pulse until user selects - imported picks from db shouldn't pulse

  // Runs on initial render so that the slider doesn't animate picks after submit
  useEffect(() => {
    handlePick(pick);
  });

  const handlePick = (teamId: number | null) => {
    setPick(teamId);

    // Handle conditional styling
    if (teamId === game.home_team_id) {
      // Set home gradient
      setGradient("bg-gradient-to-r from-gray-600 via-gray-600 to-green-600");

      // If there was no existing pick OR the new pick is a new value, we animate and outline
      teamId === existingPick
        ? handleCardAnimationChange("none")
        : handleCardAnimationChange("home");
    } else if (teamId === game.away_team_id) {
      // Set away team gradient
      setGradient("bg-gradient-to-r from-green-600 via-gray-600 to-gray-600");

      // If there was no existing pick OR the new pick is a new value, we animate and outline
      teamId === existingPick
        ? handleCardAnimationChange("none")
        : handleCardAnimationChange("away");
    } else {
      // Remove gradient for null pick
      setGradient("bg-gray-600");

      handleCardAnimationChange("none");
    }
  };

  const handleCardAnimationChange = (cardVariant: "home" | "away" | "none") => {
    if (cardVariant === "home") {
      setHomeTeamAnimation("animate-pulse");
      setAwayTeamAnimation("animate-none");
    } else if (cardVariant === "away") {
      setHomeTeamAnimation("animate-none");
      setAwayTeamAnimation("animate-pulse");
    } else {
      setHomeTeamAnimation("animate-none");
      setAwayTeamAnimation("animate-none");
    }
  };

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const currentDatetime = new Date();
    const gameStart = new Date(game.start_time);

    // Can't make updates to games that have already started
    if (gameStart < currentDatetime) {
      return;
    }

    const sliderWidth = e.currentTarget.offsetWidth;
    const clickPosition =
      e.clientX - e.currentTarget.getBoundingClientRect().left;

    // Calculate the click position as a percentage of the width
    const clickPercentage = (clickPosition / sliderWidth) * 100;

    if (clickPercentage < 33) {
      // Styling
      handlePick(game.away_team_id);

      // Pick Maker Parent
      handlePickChange(game.game_id, game.away_team_id);
    } else if (clickPercentage > 66) {
      // Styling
      handlePick(game.home_team_id);

      // Pick Maker Parent
      handlePickChange(game.game_id, game.home_team_id);
    } else {
      // Styling
      handlePick(null);

      // Pick Maker Parent
      handlePickChange(game.game_id, null);
    }
  };

  return (
    <Card className={`my-2 ${gradient}`}>
      <div
        className={`flex items-center justify-center space-x-4 min-w-[350px] rounded-sm`}
        onClick={handleSliderClick}
      >
        <div className="relative w-full h-16 cursor-pointer">
          {/* Away Team Label */}
          <div
            className={`absolute left-4 top-0 bottom-0 flex items-center justify-start w-1/2 text-sm font-semibold text-white z-10 ${awayTeamAnimation}`}
          >
            {game.away_team_nickname}
          </div>
          {/* Game Start Details */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-white z-10`}
          >
            {new Date(game.start_time).toLocaleTimeString()}
          </div>
          {/* Home Team Label */}
          <div
            className={`absolute right-4 top-0 bottom-0 flex items-center justify-end w-1/2 text-sm font-semibold text-white z-10 ${homeTeamAnimation}`}
          >
            {game.home_team_nickname}
          </div>
        </div>
      </div>
    </Card>
  );
};

export { PickSlider };
