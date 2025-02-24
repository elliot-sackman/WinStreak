import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { Contest, Entry, Game, Pick, existingPicksObject } from "@/lib/types";
import { EnterContestButton } from "@/components/enter-contest-button";
import { PickMaker } from "@/components/pick-maker";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ContestDetailsButtonNav from "../components/contest-details-button-nav";
import Leaderboard from "../components/leaderboard";
import MyPicksDisplay from "@/components/my-picks-display";

interface ContestPageProps {
  params: Promise<{ contest_name_slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const maximumDaysInAdvanceByLeagueMapping: {
  [leagueAbbreviation: string]: number;
} = {
  MLB: 2,
  NFL: 6,
  NBA: 3,
};

export default async function ContestPage(props: ContestPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const supabase = await createClient();
  const { contest_name_slug } = params;

  // Updates the current view based on which nav button is selected
  const view = searchParams?.view || "home";

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

  const { data: activeEntry, error: entryError } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("contest_id", contest.contest_id) // Match the current contest ID
    .eq("is_complete", false) // Ensure the entry is still active
    .single<Entry>(); // Expecting at most one active entry

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

  const { data: existingPicks, error: picksError } = await supabase
    .from("picks")
    .select("*")
    .eq("entry_id", activeEntry?.entry_id);

  const existingPicksObject: existingPicksObject = {};

  existingPicks?.forEach((pick: Pick) => {
    existingPicksObject[pick.game_id] = {
      teamId: pick.value,
      pickId: pick.pick_id,
    };
  });

  return (
    <div className="container mx-auto p-6 text-center place-items-center min-w-[350px]">
      <h1 className="text-2xl font-bold">{contest.contest_name}</h1>
      Sponsored By:
      <Link href={contest.sponsor_site_url!}>
        <Image
          src={contest.sponsor_logo_url!}
          alt="Sponsor Logo"
          width={200}
          height={100}
        />
      </Link>
      <Card className="bg-green-600 text-white text-xl font-semibold h-20 content-center my-2 w-full">
        <div>Prize: ${contest.contest_prize}</div>
      </Card>
      <ContestDetailsButtonNav activeEntry={activeEntry} />
      <Separator className="my-4" />
      {/* Contest Details View: Home */}
      {view === "home" && (
        <div className="w-full flex flex-col h-full items-center justify-center">
          <div className="border border-input bg-gray-600 text-white rounded-sm w-full h-12 content-center">
            Current Streak
          </div>
          <div className="w-24 h-24 my-4 rounded-full bg-gray-200 border-2 border-gray-300 shadow-lg flex items-center justify-center text-5xl text-black">
            {activeEntry?.current_streak}
          </div>

          <div className="border border-input bg-gray-600 text-white rounded-sm w-full h-12 content-center">
            Contest Overview
          </div>
          <p className="my-6">{contest.contest_description}</p>
          <Leaderboard numEntries={10} supabase={supabase} contest={contest} />
        </div>
      )}
      {/* Contest Details View: Rules */}
      {view === "rules" && (
        <div className="w-full max-w-[350px]">
          <div className="border border-input bg-gray-600 text-white rounded-sm w-full h-12 content-center">
            Rules
          </div>
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
        </div>
      )}
      {/* Contest Details View: Leaderboard */}
      {view === "leaderboard" && (
        <div className="w-full">
          <Leaderboard supabase={supabase} contest={contest} />
        </div>
      )}
      {/* Contest Details View: Make Picks */}
      {view === "make-picks" && activeEntry && (
        <PickMaker
          games={games}
          entry={activeEntry}
          existingPicks={existingPicksObject || {}}
        />
      )}
      {/* Contest Details View: My Picks */}
      {view === "my-picks" && activeEntry && (
        <div className="w-full flex flex-col h-full items-center justify-center">
          <div className="border border-input bg-gray-600 text-white rounded-sm w-full h-12 content-center">
            Current Streak
          </div>
          <div className="w-24 h-24 my-4 rounded-full bg-gray-200 border-2 border-gray-300 shadow-lg flex items-center justify-center text-5xl text-black">
            {activeEntry?.current_streak}
          </div>

          <MyPicksDisplay picks={existingPicks || []} />
        </div>
      )}
      {!activeEntry && (
        <div className="sticky inset-x-0 bottom-0 bg-transparent w-full z-10">
          <EnterContestButton contest={contest} userId={user.id} />
        </div>
      )}
    </div>
  );
}
