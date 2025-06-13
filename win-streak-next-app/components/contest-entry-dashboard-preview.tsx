import { Card } from "@/components/ui/card";
import { Contest, Entry } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import baseball from "@/app/static-images/baseball.png";

interface ContestEntryDashboardCard {
  contest: Contest;
  user: User;
  entry: Entry;
}

export default function ContestEntryDashboardCard({
  contest,
  entry,
}: ContestEntryDashboardCard) {
  const router = useRouter();
  const handleViewContestDetails = async () => {
    // Redirect to contests page after successful entry
    router.push(`/contests/${contest.contest_name_slug}`);
  };
  return (
    <Card className="flex flex-row justify-between rounded-lg px-4 py-4 w-full items-center">
      <Image
        src={baseball}
        height={50}
        width={50}
        className="w-auto mr-4"
        alt="sports logo"
      />
      <div className="flex flex-col justify-between w-full">
        <h1 className="text-md text-left w-full">{contest.contest_name}</h1>
        <div className="flex flex-row items-center justify-start w-full max-w-[70%]">
          <span className="text-xs">Current Streak</span>
          <div className="w-2 h-[1px] rounded-r-full bg-white mx-2"></div>
          <div className="text-xs">
            <span>{entry.current_streak}</span>
          </div>
        </div>
      </div>
      <Button
        variant="enter"
        onClick={handleViewContestDetails}
        className="flex flex-row items-center justify-center text-2xl font-bold"
      >
        →
      </Button>
    </Card>
  );
}
