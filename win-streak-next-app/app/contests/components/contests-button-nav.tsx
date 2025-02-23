"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ContestsButtonNav({
  contestFilters,
}: {
  contestFilters: { [key: string]: string }[];
}) {
  const [currentView, setCurrentView] = useState<string>("all");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currView = searchParams.get("view") || "all";
    setCurrentView(currView);
  });

  const createUrl = (view: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", view);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="h-12 my-2 overflow-x-auto whitespace-nowrap max-w-[350px] min-w-[350px] scrollbar-hide">
      {contestFilters.map((filterObj) => {
        return (
          <Link href={createUrl(filterObj.filter)} key={filterObj.filter}>
            <Button
              variant={currentView === filterObj.filter ? "default" : "outline"}
              className="mx-1"
            >
              {filterObj.title}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
