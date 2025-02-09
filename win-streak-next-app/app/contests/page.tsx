import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ContestsTable } from "./components/contests-table";
import { Contest } from "@/lib/types";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default async function Contests() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const contests: Contest[] | null = (await supabase.from("contests").select())
    .data;

  const contestFilters = [
    {
      filter: "all",
      title: "All",
      contests: contests || [],
    },
    {
      filter: "active",
      title: "Active",
      contests:
        contests?.filter(
          (contests) => contests.contest_status === "in_progress"
        ) || [],
    },
    {
      filter: "upcoming",
      title: "Upcoming",
      contests:
        contests?.filter(
          (contests) => contests.contest_status === "scheduled"
        ) || [],
    },
    {
      filter: "previous",
      title: "Previous",
      contests:
        contests?.filter((contests) => contests.contest_status === "ended") ||
        [],
    },
    {
      filter: "my",
      title: "My",
      contests: contests || [],
    },
  ];

  return (
    <Tabs defaultValue="all" className="max-w-5xl w-full text-center">
      <TabsList>
        {contestFilters.map((filterObj) => {
          return (
            <TabsTrigger value={filterObj.filter}>
              {filterObj.title}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {contestFilters.map((filterObj) => {
        return (
          <TabsContent value={filterObj.filter}>
            <ContestsTable filterObj={filterObj}></ContestsTable>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
