"use client";

import { useState } from "react";
import ButtonNav from "@/components/button-nav";
import { PicksDataByContestAndEntry } from "@/lib/types";
import MyPicksDisplay from "@/components/my-picks-display";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ViewContestDetailsButton } from "@/components/view-contest-details-button";
import { fail } from "assert";

export default function MyPicksPageView({
  allUserPicksData,
}: {
  allUserPicksData: PicksDataByContestAndEntry[];
}) {
  const [currentView, setCurrentView] = useState<string>("active");
  const myPicksFilters = [
    { filter: "active", title: "Active Entries" },
    { filter: "past", title: "Past Entries" },
  ];

  const picksFromActiveEntries: PicksDataByContestAndEntry[] = [];
  const picksFromInactiveEntries: PicksDataByContestAndEntry[] = [];

  const failedEntryEmojis = [
    "😞",
    "😮‍💨",
    "📉",
    "😭",
    "🤬",
    "🫣",
    "🤮",
    "💀",
    "🤡",
    "☠️",
  ];

  allUserPicksData.forEach((contest) => {
    const activeEntries = contest.user_entries.filter(
      (entry) => !entry.is_complete
    );
    const inactiveEntries = contest.user_entries.filter(
      (entry) => entry.is_complete
    );

    if (activeEntries.length > 0) {
      picksFromActiveEntries.push({
        ...contest,
        user_entries: activeEntries,
      });
    }
    if (inactiveEntries.length > 0) {
      picksFromInactiveEntries.push({
        ...contest,
        user_entries: inactiveEntries,
      });
    }
  });
  return (
    <div>
      <ButtonNav
        filters={myPicksFilters}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      {currentView === "active" && (
        <Accordion type="multiple">
          {picksFromActiveEntries.map((contest) => (
            <AccordionItem
              value={"contest_id-" + contest.contest_id}
              key={contest.contest_id}
              className="my-4"
            >
              <AccordionTrigger className="relative flex items-center justify-between w-full max-w-sm h-8 text-xl rounded-sm my-4">
                <span className="text-xl">{contest.contest_name}</span>
                <span className="text-xl">
                  🔥
                  {contest.user_entries[0].current_streak}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                {contest.user_entries.map((entry) => {
                  return (
                    <div key={"entry-" + entry.entry_id}>
                      {entry.entry_picks ? (
                        <MyPicksDisplay
                          key={entry.entry_id}
                          picks={entry.entry_picks || []}
                        />
                      ) : (
                        <div>Make some picks!</div>
                      )}
                    </div>
                  );
                })}
                <ViewContestDetailsButton
                  contestNameSlug={contest.contest_name_slug}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {currentView === "past" && (
        <Accordion type="multiple">
          {picksFromInactiveEntries.map((contest) => (
            <AccordionItem
              value={"contest_id-" + contest.contest_id}
              key={contest.contest_id}
              className="my-4"
            >
              <AccordionTrigger className="relative flex items-center justify-between w-full max-w-sm h-8 text-xl rounded-sm my-4">
                <span className="text-xl">{contest.contest_name}</span>
              </AccordionTrigger>
              <AccordionContent>
                {contest.user_entries.map((entry) => {
                  return (
                    <Accordion type="multiple" key={"entry-" + entry.entry_id}>
                      {entry.entry_picks ? (
                        <AccordionItem
                          value={"entry-" + entry.entry_id}
                          key={entry.entry_id}
                        >
                          <AccordionTrigger>
                            <div className="flex flex-row justify-between items-center w-3/4">
                              <span className="text-5xl">
                                {entry.is_winner
                                  ? "👑 "
                                  : `${failedEntryEmojis[entry.entry_number % failedEntryEmojis.length]} `}
                              </span>
                              <span className="text-xl">
                                Entry #{entry.entry_number + 1}
                              </span>
                              <span className="text-xl">
                                🔥{entry.current_streak}{" "}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <MyPicksDisplay
                              key={entry.entry_id}
                              picks={entry.entry_picks || []}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ) : (
                        <div>Make some picks!</div>
                      )}
                    </Accordion>
                  );
                })}
                <ViewContestDetailsButton
                  contestNameSlug={contest.contest_name_slug}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
