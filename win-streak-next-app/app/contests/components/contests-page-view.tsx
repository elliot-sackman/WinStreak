"use client";

import { useState } from "react";
import { Contest, Entry } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { ContestsTable } from "../components/contests-table";
import ButtonNav from "@/components/button-nav";

export default function ContestsPageView({
  contests,
  entries,
  user,
}: {
  contests: Contest[];
  entries: Entry[];
  user: User;
}) {
  const [currentView, setCurrentView] = useState<string>("all");

  const contestFilters = [
    {
      filter: "all",
      title: "All",
    },
    {
      filter: "my",
      title: "My Entries",
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
  ];

  return (
    <div className="max-w-sm">
      <ButtonNav
        filters={contestFilters}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <div className="flex-1 mx-auto w-full">
        {contestFilters.map((contestFilterObj) => {
          return (
            contestFilterObj.filter === currentView && (
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
