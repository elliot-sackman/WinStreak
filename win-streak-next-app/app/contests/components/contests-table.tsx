import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Contest, Entry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ContestDetailsCard } from "@/components/contests-details-card";
import { User } from "@supabase/supabase-js";

interface ContestTableProps {
  contestFilter: string;
  user: User;
  contests: Contest[];
  entries: Entry[];
}

const ContestsTable = function ({
  contestFilter,
  user,
  contests,
  entries,
}: ContestTableProps) {
  var currentUserEntryIds = entries
    .filter((entry) => entry.is_complete === false)
    .map((entry) => entry.contest_id);

  var filteredContests: Contest[] = [];

  if (contestFilter === "all") {
    filteredContests = contests;
  } else if (contestFilter === "active") {
    filteredContests = contests.filter(
      (contest) => contest.contest_status === "in_progress"
    );
  } else if (contestFilter === "upcoming") {
    filteredContests = contests.filter(
      (contest) => contest.contest_status === "scheduled"
    );
  } else if (contestFilter === "previous") {
    filteredContests = contests.filter(
      (contest) => contest.contest_status === "ended"
    );
  } else {
    filteredContests = contests.filter((contest) =>
      currentUserEntryIds.includes(contest.contest_id)
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="overflow-x-scroll scrollbar-hide whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Target Streak</TableHead>
            <TableHead>Cash Prize</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContests.map((contest) => {
            return (
              <TableRow key={contest.contest_id}>
                <TableCell>
                  <ContestDetailsCard
                    contest={contest}
                    user={user}
                    userHasEntered={currentUserEntryIds.includes(
                      contest.contest_id
                    )}
                    triggerElement={
                      <span className="text-blue-500 cursor-pointer hover:underline">
                        {contest.contest_name}
                      </span>
                    }
                  />
                </TableCell>
                <TableCell>{contest.streak_length}</TableCell>
                <TableCell>${contest.contest_prize}</TableCell>
                <TableCell>
                  <ContestDetailsCard
                    contest={contest}
                    user={user}
                    userHasEntered={currentUserEntryIds.includes(
                      contest.contest_id
                    )}
                    triggerElement={<Button variant="enter">View</Button>}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export { ContestsTable };
