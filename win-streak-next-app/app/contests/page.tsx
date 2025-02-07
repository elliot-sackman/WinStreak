import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AllContestsTable } from "./all-contests";

export default async function AllContests() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">All Contests</h3>
        <p className="text-sm text-muted-foreground">
          View active, past, and upcoming contests.
        </p>
      </div>
      <Separator />
      <AllContestsTable />
    </div>
  );
}
