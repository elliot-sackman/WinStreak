import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ContestsTable } from "./components/contests-table";
import { Contest, Entry } from "@/lib/types";

export default async function Contests() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const contests: Contest[] =
    (await supabase.from("contests").select()).data || [];

  const entries: Entry[] = (await supabase.from("entries").select()).data || [];

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium w-full">Contests</h3>
        <p className="text-sm text-muted-foreground">
          View active, past, and upcoming contests.
        </p>
      </div>
      <Separator />
      <div className="flex-1 mx-auto w-full md:max-w-5xl">
        <Tabs defaultValue="all" className="w-full text-center">
          <TabsList className="w-full">
            {contestFilters.map((contestFilterObject) => {
              return (
                <TabsTrigger value={contestFilterObject.filter}>
                  {contestFilterObject.title}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {contestFilters.map((contestFilterObject) => {
            return (
              <TabsContent value={contestFilterObject.filter}>
                <ContestsTable
                  contestFilter={contestFilterObject.filter}
                  user={user}
                  contests={contests}
                  entries={entries}
                ></ContestsTable>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
