"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Contest } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { EnterContestButton } from "./enter-contest-button";

interface ContestDetailsCardProps {
  contest: Contest;
  user: User;
  userHasEntered: boolean;
  triggerElement: React.ReactNode; // This defines what will trigger the modal
}

const ContestDetailsCard = function ({
  contest,
  user,
  userHasEntered,
  triggerElement,
}: ContestDetailsCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{contest.contest_name}</DialogTitle>
          <DialogDescription>
            View contest details and information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <strong>Sport:</strong> {contest.sport}
          </p>
          <p>
            <strong>League:</strong> {contest.league_name}
          </p>
          <p>
            <strong>Streak Length:</strong> {contest.streak_length}
          </p>
          <p>
            <strong>Prize:</strong> ${contest.contest_prize}
          </p>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(contest.contest_start_datetime).toLocaleString()}
          </p>
          {contest.contest_end_datetime && (
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(contest.contest_end_datetime).toLocaleString()}
            </p>
          )}
          <p>
            <strong>Status:</strong> {contest.contest_status}
          </p>
          <EnterContestButton
            contestId={contest.contest_id}
            userId={user.id}
            userHasEntered={userHasEntered}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ContestDetailsCard };
