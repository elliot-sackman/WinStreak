import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { Contest, Entry, Game, Pick, existingPicksObject } from "@/lib/types";
import { EnterContestButton } from "@/components/enter-contest-button";
import { PickMaker } from "@/components/pick-maker";
import { Separator } from "@/components/ui/separator";

interface ContestPageProps {
  params: { contest_name_slug: string };
}

const maximumDaysInAdvanceByLeagueMapping: {
  [leagueAbbreviation: string]: number;
} = {
  MLB: 2,
  NFL: 6,
  NBA: 3,
};

export default async function ContestPage({ params }: ContestPageProps) {
  const supabase = await createClient();
  const { contest_name_slug } = await params;

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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold w-2000">{contest.contest_name}</h1>
      <p className="text-muted-foreground">
        {contest.sport} - {contest.league_name}
      </p>
      <p>Target Stat: {contest.target_stat}</p>
      <p>Streak Length: {contest.streak_length}</p>
      <p>Prize: ${contest.contest_prize}</p>
      <div className="text-center">
        <Separator className="my-4" />
        {activeEntry ? (
          <>
            <PickMaker
              games={games}
              entry={activeEntry}
              existingPicks={existingPicksObject || {}}
            />
          </>
        ) : (
          <EnterContestButton
            contestId={contest.contest_id}
            contestNameSlug={contest_name_slug}
            userId={user.id}
            userHasEntered={false}
          />
        )}
      </div>
    </div>
  );
}
