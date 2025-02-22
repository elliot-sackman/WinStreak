import { Contest, Entry } from "@/lib/types";
import { SupabaseClient } from "@supabase/supabase-js";

interface LeaderboardProps {
  numEntries?: number;
  supabase: SupabaseClient;
  contest: Contest;
}

export default async function Leaderboard({
  numEntries,
  supabase,
  contest,
}: LeaderboardProps) {
  const contestIsComplete = contest.contest_status === "ended";

  const { data: rawEntries, error } = await supabase
    .from("entries")
    .select("*")
    .eq("contest_id", contest.contest_id)
    .eq("is_complete", contestIsComplete)
    .order("current_streak", { ascending: false })
    .limit(numEntries || 10000); // Maybe update this later to conditionally apply the limit or not

  const topEntries = rawEntries as Entry[];

  return (
    <>
      <div className="border border-input bg-gray-600 text-white rounded-sm w-full h-12 content-center">
        Leaderboard
      </div>
      {topEntries?.map((entry: Entry, index: number) => {
        return (
          <div className="my-2 text-left" key={index}>
            {index + ". " + entry.display_name + " " + entry.current_streak}
          </div>
        );
      })}
    </>
  );
}
