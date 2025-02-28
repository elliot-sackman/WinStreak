import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardView from "./components/dashboard-view";
import { Contest, Entry } from "@/lib/types";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const contests: Contest[] =
    (await supabase.from("contests").select()).data || [];

  const entries: Entry[] =
    (await supabase.from("entries").select("*").eq("user_id", user.id)).data ||
    [];

  // Switch from using tabs to using buttons nav like contest details page.
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium w-full">Dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Welcome back {user.user_metadata.username}!
        </p>
      </div>
      <DashboardView contests={contests} entries={entries} user={user} />
    </div>
  );
}
