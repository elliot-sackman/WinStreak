"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Entry } from "@/lib/types";

interface ButtonContestNavProps {
  activeEntry: Entry | null | undefined;
}

export default function ButtonContestNav({
  activeEntry,
}: ButtonContestNavProps) {
  const [currentView, setCurrentView] = useState<string>("home");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currView = searchParams.get("view") || "home";
    setCurrentView(currView);
  });

  const createUrl = (view: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", view);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="h-12 my-2 overflow-x-auto whitespace-nowrap max-w-[350px] min-w-[350px] scrollbar-hide">
      <Link href={createUrl("home")}>
        <Button
          variant={currentView === "home" ? "default" : "outline"}
          className="mx-1"
        >
          Home
        </Button>
      </Link>

      <Link href={createUrl("rules")}>
        <Button
          variant={currentView === "rules" ? "default" : "outline"}
          className="mx-1"
        >
          Rules
        </Button>
      </Link>
      <Link href={createUrl("leaderboard")}>
        <Button
          variant={currentView === "leaderboard" ? "default" : "outline"}
          className="mx-1"
        >
          Leaderboard
        </Button>
      </Link>
      {activeEntry && (
        <>
          <Link href={createUrl("games")}>
            <Button
              variant={currentView === "games" ? "default" : "outline"}
              className="mx-1"
            >
              Games
            </Button>
          </Link>
          <Link href={createUrl("my-picks")}>
            <Button
              variant={currentView === "my-picks" ? "default" : "outline"}
              className="mx-1"
            >
              My Picks
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
