import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { PicksDataByContestAndEntry } from "@/lib/types";
import MyPicksPageView from "./components/my-picks-page-view";

export default async function MyPicks() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Call the Postgres function to get analytics
  const { data: analytics, error: analyticsError } = await supabase.rpc(
    "get_user_pick_analytics",
    {
      uid: user.id,
    }
  );

  if (analyticsError) {
    console.error("Error fetching analytics:", analyticsError);
  }

  const { data: rawUserPicksData, error: picksError } = await supabase.rpc(
    "get_user_all_picks_data",
    {
      uid: user.id,
    }
  );

  const allUserPicksData = rawUserPicksData as PicksDataByContestAndEntry[];

  if (picksError) {
    console.error("Error fetching picks:", picksError);
  }

  return (
    <div className="flex justify-center items-center">
      <div className="space-y-6 w-full max-w-sm sm:max-w-sm">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium w-full text-left">My Picks</h1>
          <p className="text-sm text-muted-foreground text-left">
            View your performance and streaks.
          </p>
        </div>
        {allUserPicksData && allUserPicksData.length > 0 ? (
          <>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col bg-primary-background border-[1px] border-green-600 rounded-sm p-2 sm:p-4 text-center">
                <p className="text-2xl sm:text-3xl">
                  ✅ {analytics.total_correct_picks}
                </p>
                <p className="text-xs text-muted-foreground">Correct Picks</p>
              </div>
              <div className="flex flex-col bg-primary-background border-[1px] border-green-600 rounded-sm p-2 sm:p-4 text-center">
                <p className="text-2xl sm:text-3xl">
                  {analytics.correct_percentage.toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">Pick Win Rate</p>
              </div>
              <div className="flex flex-col bg-primary-background border-[1px] border-green-600 rounded-sm p-2 sm:p-4 text-center">
                <p className="text-2xl sm:text-3xl">
                  🔥{analytics.longest_streak}
                </p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
            </div>
            <Separator />
            <MyPicksPageView allUserPicksData={allUserPicksData} />
          </>
        ) : (
          <div>Make some picks and come back!</div>
        )}
      </div>
    </div>
  );
}
