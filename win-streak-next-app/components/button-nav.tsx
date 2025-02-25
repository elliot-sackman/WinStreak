"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ButtonNav({
  filters,
}: {
  filters: { [key: string]: string }[];
}) {
  const [currentView, setCurrentView] = useState<string>(filters![0].filter);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const currView = searchParams.get("view") || "all";
    setCurrentView(currView);
  });

  const updateView = (view: string) => {
    setCurrentView(view);
    router.push(`?view=${view}`, { scroll: false });
  };
  return (
    <div className="h-12 my-2 overflow-x-auto whitespace-nowrap max-w-[350px] min-w-[350px] scrollbar-hide">
      {filters.map((filterObj) => {
        return (
          <Button
            key={filterObj.filter}
            variant={currentView === filterObj.filter ? "default" : "outline"}
            className="mx-1"
            onClick={() => {
              updateView(filterObj.filter);
            }}
          >
            {filterObj.title}
          </Button>
        );
      })}
    </div>
  );
}
