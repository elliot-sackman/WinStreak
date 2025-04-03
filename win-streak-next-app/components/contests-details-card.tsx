"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "./ui/card";
import { Contest } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { EnterContestButton } from "@/components/enter-contest-button";
import { ViewContestDetailsButton } from "@/components/view-contest-details-button";

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
      <DialogContent className="max-w-sm rounded-lg">
        <DialogHeader className="text-center items-center justify-center">
          <DialogTitle>{contest.contest_name}</DialogTitle>
          {contest.sponsor_id && (
            <DialogDescription className="text-center">
              Sponsored By:
              <Link href={contest.sponsor_site_url!}>
                <Image
                  src={contest.sponsor_logo_url!}
                  alt="Sponsor Logo"
                  width={200}
                  height={100}
                />
              </Link>
            </DialogDescription>
          )}
          <Card className="bg-green-600 text-white text-xl text-center font-semibold h-20 content-center my-2 w-3/4">
            <div>Prize: ${contest.contest_prize}</div>
          </Card>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <strong>Sport:</strong> {contest.sport}
          </p>
          <p>
            <strong>League:</strong> {contest.league_abbreviation}
          </p>
          <p>
            <strong>Winning Streak:</strong> {contest.streak_length} Correct
            Picks
          </p>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(contest.contest_start_datetime).toLocaleString()}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {contest.contest_end_datetime
              ? new Date(contest.contest_end_datetime).toLocaleDateString()
              : "Until someone wins."}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {contest.contest_status === "in_progress"
              ? "In Progress"
              : contest.contest_status === "scheduled"
                ? "Not Started"
                : "Ended"}
          </p>
          <p>
            <strong>Reentries Allowed:</strong>{" "}
            {contest.reentries_allowed ? "Yes" : "No"}
          </p>
          {!userHasEntered && contest.contest_status === "in_progress" && (
            <EnterContestButton contest={contest} userId={user.id} />
          )}
          <ViewContestDetailsButton
            contestNameSlug={contest.contest_name_slug}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ContestDetailsCard };
