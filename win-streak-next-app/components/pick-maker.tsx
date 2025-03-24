"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PickSlider } from "./pick-slider";
import { Game, Entry, existingPicksObject, newPicksObject } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface PickMakerProps {
  games: Game[];
  entry: Entry;
  existingPicks: existingPicksObject;
}

const PickMaker = function ({ games, entry, existingPicks }: PickMakerProps) {
  // State variables for conditional rendering of content
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState<
    boolean | undefined
  >(true);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  // State variables for handling of making picks
  const [newPicks, setNewPicks] = useState<newPicksObject>({});
  const [modifiedPicks, setModifiedPicks] = useState<existingPicksObject>({});
  const [picksToDelete, setPicksToDelete] = useState<number[]>([]);

  const router = useRouter();

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
        localPicksToDelete.indexOf(pickId) === -1
          ? localPicksToDelete.push(pickId)
          : null;
        delete localModifiedPicks[gameId];
      }
    } else {
      if (teamId) {
        // If the teamId isn't null, update the pick in the newPicks object
        localNewPicks[gameId] = teamId;
      } else {
        // If the teamId is null, we're canceling the pick, remove it from newPicks object
        delete localNewPicks[gameId];
      }
    }

    Object.keys(localNewPicks).length === 0 &&
    Object.keys(localModifiedPicks).length === 0 &&
    localPicksToDelete.length === 0
      ? setSubmitButtonDisabled(true)
      : setSubmitButtonDisabled(false);

    // Now, we set all of the state variables
    setNewPicks(localNewPicks);
    setModifiedPicks(localModifiedPicks);
    setPicksToDelete(localPicksToDelete);
  };

  const handleConfirmSubmit = async () => {
    const insertPicks = Object.keys(newPicks).map((gameId) => {
      return createNewPickObject(parseInt(gameId), newPicks[parseInt(gameId)]);
    });

    const updatePicks = Object.keys(modifiedPicks).map((gameId) => {
      const { pickId, teamId } = modifiedPicks[parseInt(gameId)];
      return createModifiedPickObject(pickId, teamId);
    });

    const deletePicks = picksToDelete;

    if (
      Object.keys(existingPicks).length +
        insertPicks.length -
        deletePicks.length >
      entry.contest_streak_length
    ) {
      toast({
        title: "Error.",
        description: "You cannot submit more picks than the target streak.",
      });

      return;
    }

    const supabase = createClient();

    // Handling in one Postgres function so that entire submit is rolled back if there's an error (say a user tries to modify a pick for a game that's already started)
    const { data, error } = await supabase.rpc("handle_picks", {
      insert_data: insertPicks,
      update_data: updatePicks,
      delete_data: deletePicks,
    });

    // Display toast message with results
    if (error) {
      toast({
        title: "Error!",
        description: `Your picks have not been submitted due to error: ${error}`,
      });

      // Don't update the state variables if there was an error with the transaction.
      return;
    } else {
      toast({
        title: "Success!",
        description: "Your picks are in.",
      });
    }

    setNewPicks({});
    setModifiedPicks({});
    setPicksToDelete([]);
    setSubmitButtonDisabled(true);
    setShowDialog(false);
    router.refresh();
  };

  const createNewPickObject = (gameId: number, teamId: number) => {
    return {
      contest_id: entry.contest_id,
      entry_id: entry.entry_id,
      user_id: entry.user_id,
      pick_type: "wins", // Until further notice, all picks are wins
      value: teamId,
      game_id: gameId,
      pick_status: "pending",
    };
  };

  const createModifiedPickObject = (pickId: number, teamId: number) => {
    return {
      pick_id: pickId,
      value: teamId,
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

  const getGameDetailsObjectForConfirmationSummary = () => {
    const gameDetailsObject: { [gameId: number]: Game } = {};

    games.forEach((game: Game) => {
      gameDetailsObject[game.game_id] = game;
    });

    return gameDetailsObject;
  };

  const gameDetailsObject = getGameDetailsObjectForConfirmationSummary();

  const getPicksByPickId = () => {
    const picksByPickId: {
      [pickId: number]: { gameId: number; teamId: number };
    } = {};

    Object.keys(existingPicks).forEach((gameId: string) => {
      const { pickId, teamId } = existingPicks[parseInt(gameId)];

      picksByPickId[pickId] = { gameId: parseInt(gameId), teamId };
    });

    return picksByPickId;
  };

  const picksByPickId = getPicksByPickId();

  return (
    <div className="w-full">
      <Card className="bg-neutral-500">
        <h2 className="flex items-center justify-center space-x-4 min-w-[350px] h-12 text-xl rounded-sm text-white">
          Upcoming Games
        </h2>
      </Card>

      {Object.keys(gamesByDate).map((dateString) => {
        return (
          <div key={dateString} className="my-2">
            <h2>{dateString}</h2>
            {gamesByDate[dateString].map((game: Game) => {
              return (
                <PickSlider
                  game={game}
                  key={game.game_id}
                  existingPick={existingPicks[game.game_id]?.teamId}
                  handlePickChange={handlePickChange}
                />
              );
            })}
          </div>
        );
      })}
      {!submitButtonDisabled && (
        <div className="w-full sticky bottom-0 z-10 bg-primary-foreground">
          <Button
            className="w-full h-12 text-xl my-6"
            variant="enter"
            onClick={() => {
              setShowDialog(true);
            }}
          >
            Submit Picks
          </Button>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Picks</DialogTitle>
            <DialogDescription>
              View pick changes summary below.
            </DialogDescription>
          </DialogHeader>

          {Object.keys(newPicks).length > 0 && (
            <div>
              <h2 className="font-semibold">New Picks:</h2>
              {Object.keys(newPicks).map((gameId: string) => {
                const game = gameDetailsObject[parseInt(gameId)];
                const pickedTeamId = newPicks[parseInt(gameId)];
                const pickedTeamName =
                  game.home_team_id === pickedTeamId
                    ? game.home_team_nickname
                    : game.away_team_nickname;
                return (
                  <div key={gameId}>
                    {game.away_team_nickname +
                      " vs. " +
                      game.home_team_nickname +
                      ": " +
                      pickedTeamName}
                  </div>
                );
              })}
            </div>
          )}

          {Object.keys(modifiedPicks).length > 0 && (
            <div>
              <h2 className="font-semibold">Modified Picks:</h2>
              {Object.keys(modifiedPicks).map((gameId: string) => {
                const { home_team_id, home_team_nickname, away_team_nickname } =
                  gameDetailsObject[parseInt(gameId)];
                const pickedTeamId = newPicks[parseInt(gameId)];
                const pickedTeamName =
                  home_team_id === pickedTeamId
                    ? home_team_nickname
                    : away_team_nickname;
                return (
                  <div key={gameId}>
                    {away_team_nickname +
                      " vs. " +
                      home_team_nickname +
                      ": " +
                      pickedTeamName}
                  </div>
                );
              })}
            </div>
          )}

          {picksToDelete.length > 0 && (
            <div>
              <h2 className="font-semibold">Deleted Picks:</h2>
              {picksToDelete.map((pickId: number) => {
                const { gameId, teamId } = picksByPickId[pickId];
                const { home_team_id, away_team_nickname, home_team_nickname } =
                  gameDetailsObject[gameId];

                const pickedTeamName =
                  home_team_id === teamId
                    ? home_team_nickname
                    : away_team_nickname;

                return (
                  <div key={"pick" + pickId}>
                    {away_team_nickname +
                      " vs. " +
                      home_team_nickname +
                      ": " +
                      pickedTeamName}
                  </div>
                );
              })}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full my-1"
              onClick={() => {
                setShowDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="enter"
              className="w-full my-1"
              onClick={handleConfirmSubmit}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { PickMaker };
