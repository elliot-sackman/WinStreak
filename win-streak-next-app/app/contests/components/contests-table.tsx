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
import { Contest } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface ContestTableProps {
  filterObj: {
    filter: string;
    title: string;
    contests: Contest[] | null;
  };
}

const ContestsTable = function (props: ContestTableProps) {
  const { filterObj } = props;

  const contestTableColumnHeaders = [
    "Name",
    //"Sport",
    //"League",
    //"Target Stat",
    "Streak Length",
    "Contest Prize",
    //"Reentries Allowed",
    //"Contest Start",
    //"Contest End",
    //"Public",
    //"Status",
    //"Contest Winner",
  ];

  const contestTableValuePropNames: (keyof Contest)[] = [
    "contest_name",
    //"sport",
    //"league_name",
    //"target_stat",
    "streak_length",
    //"contest_prize",
    //"reentries_allowed",
    //"contest_start_datetime",
    //"contest_end_datetime",
    //"is_public",
    //"contest_status",
    //"contest_winner_display_name",
  ];

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {contestTableColumnHeaders.map((columnName) => {
              return <TableHead>{columnName}</TableHead>;
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterObj.contests?.map((contest) => {
            return (
              <TableRow>
                {contestTableValuePropNames.map((propName: keyof Contest) => {
                  return <TableCell>{contest[propName]}</TableCell>;
                })}
                <TableCell>${contest.contest_prize}</TableCell>
                <TableCell>
                  {contest.contest_status === "ended" ? (
                    <Button variant="enter" disabled={true}>
                      Contest Ended
                    </Button>
                  ) : (
                    <Button variant="enter">Enter</Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export { ContestsTable };
