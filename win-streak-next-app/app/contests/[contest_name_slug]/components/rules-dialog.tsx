import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";
import { Contest } from "@/lib/types";

export function RulesDialog({ contest }: { contest: Contest }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <InfoIcon />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contest Rules</DialogTitle>
        </DialogHeader>
        <div className="grid">
          <div className="w-full max-w-sm">
            <p className="my-6 text-left">
              <strong>General:</strong> Pick {contest.league_abbreviation} teams
              to win their games. If a team loses you're eliminated!
            </p>
            <p className="my-6 text-left">
              <strong>Race To:</strong> {contest.streak_length} wins.
            </p>
            <p className="my-6 text-left">
              <strong>Prize:</strong> ${contest.contest_prize}.
            </p>
            <p className="my-6 text-left">
              <strong>Reentries Allowed:</strong>{" "}
              {contest.reentries_allowed ? "Yes" : "No"}.
            </p>
            <p className="my-6 text-left">
              <strong>Contest Length:</strong>{" "}
              {contest.contest_end_datetime
                ? "Ends on: " +
                  new Date(contest.contest_end_datetime).toLocaleString()
                : "Until someone wins."}
            </p>
            <p className="my-6 text-left">
              View detailed contest rules{" "}
              <Link href="/contest-rules" className="text-green-600">
                here
              </Link>
              .
            </p>
          </div>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
