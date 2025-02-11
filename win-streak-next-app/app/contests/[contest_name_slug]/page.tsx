import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { Contest, Entry } from "@/lib/types";
import { EnterContestButton } from "@/components/enter-contest-button";

interface ContestPageProps {
  params: { contest_name_slug: string };
}

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">{contest.contest_name}</h1>
      <p className="text-muted-foreground">
        {contest.sport} - {contest.league_name}
      </p>
      <p>Target Stat: {contest.target_stat}</p>
      <p>Streak Length: {contest.streak_length}</p>
      <p>Prize: ${contest.contest_prize}</p>
      <div className="text-center">
        {activeEntry ? (
          "PICK UI"
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
