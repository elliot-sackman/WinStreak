import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <Tabs defaultValue="all" className="max-w-5xl w-full text-center">
      <TabsList>
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
  );
}
