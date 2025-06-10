import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardView from "./components/dashboard-view";
import { Contest, Entry } from "@/lib/types";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { contests, entries }: { contests: Contest[]; entries: Entry[] } = (
    await supabase.rpc("get_live_contests_and_user_entries_for_dashboard", {
      uid: user!.id,
    })
  ).data || { contests: [], entries: [] };

  return (
    <div className="flex min-h-screen bg-background mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl space-y-6">
        <div className="text-center">
          <h3 className="text-lg text-left font-medium">Dashboard</h3>
          <p className="text-sm text-left text-muted-foreground">
            Welcome back {user!.user_metadata.first_name}!
          </p>
        </div>
        <DashboardView
          contests={contests || []}
          entries={entries || []}
          user={user!}
        />
      </div>
    </div>
  );
}
