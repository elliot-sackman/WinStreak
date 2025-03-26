"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
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
      <CardContent className="aspect-square content-center p-6 border-black border-1 rounded-lg">
        <h1 className="text-2xl font-semibold my-2">{contest.contest_name}</h1>
        {entry && (
          <h2 className="bg-gradient-to-r from-neutral-500 via-neutral-500 to-green-600 rounded-sm p-2 text-white text-center my-2">
            Current Streak: {entry.current_streak}
          </h2>
        )}
        {contest.sponsor_id && (
          <div className="flex flex-col items-center my-2">
            <h2 className="text-neutral-500 mb-2">Sponsored By:</h2>
            <Link href={contest.sponsor_site_url!}>
              <Image
                src={contest.sponsor_logo_url!}
                alt="Sponsor Logo"
                width={200}
                height={50}
                className="w-auto"
              />
            </Link>
          </div>
        )}
        {!entry && new Date() > new Date(contest.contest_start_datetime) && (
          <EnterContestButton contest={contest} userId={user.id} />
        )}
        <ViewContestDetailsButton contestNameSlug={contest.contest_name_slug} />
      </CardContent>
    </Card>
  );
}
