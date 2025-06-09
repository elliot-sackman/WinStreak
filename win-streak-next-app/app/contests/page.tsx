import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Contest, Entry } from "@/lib/types";
import ContestsPageView from "./components/contests-page-view";

export default async function Contests() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const contests: Contest[] =
    (await supabase.from("contests").select()).data || [];

  const entries: Entry[] =
    (await supabase.from("entries").select("*").eq("user_id", user!.id)).data ||
    [];

  return (
    <div className="flex justify-center items-center">
      <div className="space-y-6 w-full max-w-xs sm:max-w-sm">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium w-full text-left">Contests</h3>
          <p className="text-sm text-muted-foreground text-left">
            View active, past, and upcoming contests.
          </p>
        </div>
        <Separator />
        <ContestsPageView contests={contests} entries={entries} user={user!} />
      </div>
    </div>
  );
}
