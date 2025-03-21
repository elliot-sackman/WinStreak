import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { Contest, Entry, Game, Pick, existingPicksObject } from "@/lib/types";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

import ContestDetailsPageView from "./components/contest-details-page-view";

interface ContestPageProps {
  params: Promise<{ contest_name_slug: string }>;
}

const maximumDaysInAdvanceByLeagueMapping: {
  [leagueAbbreviation: string]: number;
} = {
  MLB: 2,
  NFL: 6,
  NBA: 3,
};

export default async function ContestPage(props: ContestPageProps) {
  const params = await props.params;
  const supabase = await createClient();
  const { contest_name_slug } = params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: contest, error: contestError } = await supabase
    .from("contests")
    .select("*")
    .eq("contest_name_slug", contest_name_slug)
    .single<Contest>();

  if (!contest || contestError) {
    return notFound(); // Show 404 if contest doesn't exist
  }

  const { data: rawUserEntries, error: entryError } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("contest_id", contest.contest_id)
    .order("entry_number", { ascending: false }); // Match the current contest ID

  const allUserEntries = rawUserEntries as Entry[];

  const activeEntry = allUserEntries.filter(
    (entry) => entry.is_complete === false
  )
    ? allUserEntries.filter((entry) => entry.is_complete === false)[0]
    : null;

  const { data: rawLeaderboardEntries, error } = await supabase
    .from("entries")
    .select("*")
    .eq("contest_id", contest.contest_id)
    .eq("is_complete", contest.contest_status === "ended")
    .order("current_streak", { ascending: false });

  const leaderboardEntries = rawLeaderboardEntries as Entry[];

  const numDays: number =
    maximumDaysInAdvanceByLeagueMapping[contest.league_abbreviation];
  const { data: rawGames, error: gamesError } =
    (await supabase
      .from("games")
      .select("*")
      .eq("league_id", contest.league_id)
      .gte("start_time", new Date().toISOString())
      .lt(
        "start_time",
        new Date(Date.now() + numDays * 24 * 60 * 60 * 1000).toISOString()
      )) || [];

  const games: Game[] = rawGames as Game[];

  const { data: rawExistingPicks, error: picksError } = await supabase
    .from("picks")
    .select("*")
    .eq("entry_id", activeEntry?.entry_id);

  const existingPicks = rawExistingPicks as Pick[];

  return (
    <div className="container mx-auto p-6 text-center place-items-center min-w-[350px]">
      <h1 className="text-2xl font-bold">{contest.contest_name}</h1>
      {contest.sponsor_id && (
        <div>
          Sponsored By:
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

      <Card className="bg-green-600 text-white text-xl font-semibold h-20 content-center my-2 w-full">
        <div>Prize: ${contest.contest_prize}</div>
      </Card>
      <ContestDetailsPageView
        contest={contest}
        activeEntry={activeEntry}
        allUserEntries={allUserEntries}
        leaderboardEntries={leaderboardEntries}
        games={games}
        existingPicks={existingPicks || []}
        user={user}
      />
    </div>
  );
}
