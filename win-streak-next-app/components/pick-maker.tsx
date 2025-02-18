"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { PickSlider } from "./pick-slider";
import { Game, Entry, Pick } from "@/lib/types";

type existingPicksObject = {
  [gameId: number]: {
    teamId: number;
    pickId: number;
  };
};

type newPicksObject = {
  [gameId: number]: number;
};

interface PickMakerProps {
  games: Game[];
  entry: Entry;
  existingPicks: existingPicksObject;
}

const leagueDaysInAdvanceMapping = {
  MLB: 2,
};

const PickMaker = function ({ games, entry, existingPicks }: PickMakerProps) {
  // Any new picks will be made and submitted using this object
  const [newPicks, setNewPicks] = useState<newPicksObject>({});

  // Any picks that existed on load will be modified here using this object
  const [modifiedPicks, setModifiedPicks] = useState<existingPicksObject>({});

  // Picks that the user wants to delete
  const [picksToDelete, setPicksToDelete] = useState<number[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickChange = (gameId: number, teamId: number | null) => {
    let localNewPicks = { ...newPicks };
    let localModifiedPicks = { ...modifiedPicks };
    let localPicksToDelete = [...picksToDelete];

    if (gameId in existingPicks) {
      // Modifying or deleting an existing pick
      const pickId = existingPicks[gameId].pickId;

      // Updating an existing pick
      if (teamId) {
        // If we're changing the teamId to a non-null value, make sure we don't delete the pick later
        if (localPicksToDelete.indexOf(pickId) > -1) {
          localPicksToDelete.splice(localPicksToDelete.indexOf(pickId));
        }

        // If the picked team differs from the existing pick, add it to the modifiedPicks object
        if (existingPicks[gameId].teamId !== teamId) {
          localModifiedPicks[gameId] = { teamId, pickId };
        } else {
          // If we're changing it back to the original team ID, we're not modifying the pick
          delete localModifiedPicks[gameId];
        }
      } else {
        // If the teamID is being set to null, it means we're deleting the pick
        localPicksToDelete.push(pickId);
        delete localModifiedPicks[gameId];
      }
    } else if (!(gameId in existingPicks)) {
      if (teamId) {
        // If the teamId isn't null, update the pick in the newPicks object
        localNewPicks[gameId] = teamId;
      } else {
        // If the teamId is null, we're canceling the pick, remove it from newPicks object
        delete localNewPicks[gameId];
      }
    }

    // Now, we set all of the state variables
    setNewPicks(localNewPicks);
    setModifiedPicks(localModifiedPicks);
    setPicksToDelete(localPicksToDelete);
  };

  const handleSubmitPicks = async () => {
    setIsSubmitting(true);

    const insertPicks = Object.keys(newPicks).map((gameId) => {
      return createNewPickObject(parseInt(gameId), newPicks[parseInt(gameId)]);
    });

    const updatePicks = Object.keys(modifiedPicks).map((gameId) => {
      const { pickId, teamId } = modifiedPicks[parseInt(gameId)];
      return createModifiedPickObject(pickId, teamId);
    });

    const deletePicks = picksToDelete;

    const supabase = createClient();

    // Handling in one Postgres function so that entire submit is rolled back if there's an error (say a user tries to modify a pick for a game that's already started)
    const { data, error } = await supabase.rpc("handle_picks", {
      insert_data: insertPicks,
      update_data: updatePicks,
      delete_data: deletePicks,
    });

    // TODO: Toast message on successful/unsuccessful submit w summary of changes?
    console.log(data);
    console.log(error);

    setIsSubmitting(false);
  };

  const createNewPickObject = (gameId: number, teamId: number) => {
    const currentTimestamp = new Date().toISOString();

    return {
      contest_id: entry.contest_id,
      entry_id: entry.entry_id,
      user_id: entry.user_id,
      pick_type: "wins", // Until further notice, all picks are wins
      value: teamId,
      game_id: gameId,
      pick_status: "pending",
      pick_datetime: currentTimestamp,
    };
  };

  const createModifiedPickObject = (pickId: number, teamId: number) => {
    const currentTimestamp = new Date().toISOString();

    return {
      pick_id: pickId,
      value: teamId,
      pick_datetime: currentTimestamp,
    };
  };

  const getGamesByDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const gamesByDate: { [gameDate: string]: Game[] } = {};

    games.forEach((game: Game) => {
      let gameDate = new Date(game.start_time).toLocaleDateString(
        undefined,
        options
      );
      if (!(gameDate in gamesByDate)) {
        gamesByDate[gameDate] = [];
      }

      gamesByDate[gameDate].push(game);
    });
    return gamesByDate;
  };

  const gamesByDate = getGamesByDate();

  return (
    <>
      <h2 className="flex items-center justify-center space-x-4 min-w-[350px] h-12 rounded-sm bg-gray-600 text-primary-foreground">
        MLB Schedule
      </h2>

      <Accordion type="single" collapsible className="w-full">
        {Object.keys(gamesByDate).map((dateString) => {
          return (
            <AccordionItem value={dateString} key={dateString}>
              <AccordionTrigger>{dateString}</AccordionTrigger>
              <AccordionContent>
                {gamesByDate[dateString].map((game: Game) => {
                  return (
                    <div className="my-2">
                      <PickSlider game={game} />
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
};

export { PickMaker };
