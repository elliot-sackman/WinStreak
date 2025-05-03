import Image from "next/image";
import Link from "next/link";
import { AllContestGamesPicksEntries } from "@/lib/types";
import mlbContestBackground from "@/app/static-images/mlb-contest-background.jpg";
import { RulesDialog } from "./rules-dialog";

interface ContestDetailsHeaderProps {
  contestData: AllContestGamesPicksEntries;
}

export default function ContestDetailsHeader({
  contestData,
}: ContestDetailsHeaderProps) {
  const contest = contestData.contest_details!;
  const userEntries = contestData.user_entries;
  const activeEntry =
    userEntries &&
    userEntries.length > 0 &&
    userEntries[0].entry_details.is_complete === false
      ? userEntries[0].entry_details
      : null;

  return (
    <div className="relative w-full max-w-sm text-white">
      {contest.sport === "Baseball" && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url(${mlbContestBackground.src})`,
          }}
        ></div>
      )}

      {/* Content */}
      <div className="relative p-8">
        <div className="flex flex-row justify-center items-center">
          <h1 className="text-2xl font-bold mx-1">{contest.contest_name}</h1>
          <RulesDialog contest={contest} />
        </div>
        {contest.sponsor_id && (
          <div className="flex flex-col items-center my-4">
            <span className="text-white mb-2">Sponsored By:</span>
            <Link href={contest.sponsor_site_url!}>
              <Image
                src={contest.sponsor_logo_url!}
                alt="Sponsor Logo"
                width={200}
                height={100}
                style={{ width: "auto" }}
              />
            </Link>
          </div>
        )}
        {activeEntry ? (
          <div className="flex flex-row items-center my-4 justify-between w-[90%] max-w-sm">
            <span className="text-2xl italic">Your Streak</span>
            <div className="flex-grow h-[1px] rounded-r-full bg-gradient-to-r from-neutral-800 to-green-800 mx-4"></div>
            <div className="text-2xl">
              🔥<span className="italic">{activeEntry.current_streak}</span>
            </div>
          </div>
        ) : (
          contest.contest_status === "in_progress" && (
            <div>Enter the contest to start your streak 🔥</div>
          )
        )}
      </div>
    </div>
  );
}
