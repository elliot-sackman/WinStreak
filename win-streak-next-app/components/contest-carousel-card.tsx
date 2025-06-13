import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Contest, Entry } from "@/lib/types";
import { EnterContestButton } from "@/components/enter-contest-button";
import { ViewContestDetailsButton } from "@/components/view-contest-details-button";
import { User } from "@supabase/supabase-js";

interface ContestCarouselCardProps {
  contest: Contest;
  user: User;
  entry?: Entry | null;
}

export default function ContestCarouselCard({
  contest,
  user,
  entry,
}: ContestCarouselCardProps) {
  return (
    <Card>
      <CardContent className="content-center  border-black border-1 rounded-lg">
        <CardHeader>
          <h1 className="text-2xl font-semibold my-2 text-center">
            {contest.contest_name}
          </h1>

          {contest.sponsor_id && (
            <div className="flex flex-col items-center my-2">
              <h2 className="text-neutral-500 mb-2">Sponsored By:</h2>
              <Link href={contest.sponsor_site_url!}>
                <Image
                  src={contest.sponsor_logo_url!}
                  alt="Sponsor Logo"
                  width={350}
                  height={200}
                  className="h-auto"
                />
              </Link>
            </div>
          )}
        </CardHeader>

        {entry && (
          <div className="flex flex-row items-center my-2 justify-between w-[80%] max-w-sm mx-auto">
            <span className="text-xl italic">Your Streak</span>
            <div className="flex-grow h-[1px] rounded-r-full bg-gradient-to-r from-neutral-800 to-green-800 mx-4"></div>
            <div className="text-xl">
              🔥<span className="italic">{entry.current_streak}</span>
            </div>
          </div>
        )}
        <ViewContestDetailsButton contestNameSlug={contest.contest_name_slug} />
      </CardContent>
    </Card>
  );
}
