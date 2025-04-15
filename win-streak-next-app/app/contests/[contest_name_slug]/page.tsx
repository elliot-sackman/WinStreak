import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { AllContestGamesPicksEntries } from "@/lib/types";

import ContestDetailsHeader from "./components/contest-details-header";
import ContestDetailsPageView from "./components/contest-details-page-view";
import CompletedContestView from "./components/completed-contest-view";

interface ContestPageProps {
  params: Promise<{ contest_name_slug: string }>;
}

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

  const { data: contestId, error: contestError } = await supabase
    .from("contests")
    .select("contest_id")
    .eq("contest_name_slug", contest_name_slug)
    .single();

  if (!contestId || contestError) {
    return notFound(); // Show 404 if contest doesn't exist
  }

  const { data: rawContestData, error: contestDataError } = await supabase.rpc(
    "get_user_all_picks_data_by_contest",
    {
      uid: user.id,
      cid: contestId.contest_id,
    }
  );

  if (!rawContestData || contestDataError) {
    console.error("Error fetching contest data:", contestDataError);
    return notFound(); // Show 404 if no data found
  }

  const contestData = rawContestData as AllContestGamesPicksEntries;

  if (!contestData.contest_details) {
    return notFound(); // Show 404 if no data found
  }

  return (
    <div className="container mx-auto p-6 text-center place-items-center justify-center">
      <ContestDetailsHeader contestData={contestData} />
      {contestData.contest_details.contest_status === "ended" ? (
        <CompletedContestView contestData={contestData} user={user} />
      ) : (
        <ContestDetailsPageView contestData={contestData} user={user} />
      )}
    </div>
  );
}
