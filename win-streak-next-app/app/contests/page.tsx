import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ContestsTable } from "./components/contests-table";
import { Contest, Entry } from "@/lib/types";
import ButtonNav from "@/components/button-nav";

interface ContestsPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Contests(props: ContestsPageProps) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Updates the current view based on which nav button is selected
  const view = searchParams?.view || "all";

  const contests: Contest[] =
    (await supabase.from("contests").select()).data || [];

  const entries: Entry[] =
    (await supabase.from("entries").select("*").eq("user_id", user.id)).data ||
    [];

  const contestFilters = [
    {
      filter: "all",
      title: "All",
    },
    {
      filter: "active",
      title: "Active",
    },
    {
      filter: "upcoming",
      title: "Upcoming",
    },
    {
      filter: "previous",
      title: "Previous",
    },
    {
      filter: "my",
      title: "My",
    },
  ];
  // Switch from using tabs to using buttons nav like contest details page.
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium w-full">Contests</h3>
        <p className="text-sm text-muted-foreground">
          View active, past, and upcoming contests.
        </p>
      </div>
      <Separator />
      <ButtonNav filters={contestFilters} />
      <div className="flex-1 mx-auto w-full md:max-w-5xl">
        {contestFilters.map((contestFilterObj) => {
          return (
            contestFilterObj.filter === view && (
              <ContestsTable
                contestFilter={contestFilterObj.filter}
                user={user}
                contests={contests}
                entries={entries}
                key={contestFilterObj.filter}
              ></ContestsTable>
            )
          );
        })}
      </div>
    </div>
  );
}
