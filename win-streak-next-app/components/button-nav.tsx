"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ButtonNav({
  filters,
  currentView,
  setCurrentView,
}: {
  filters: { [key: string]: string }[];
  currentView: string;
  setCurrentView: Function;
}) {
  const router = useRouter();

  const updateView = (view: string) => {
    startTransition(() => {
      setCurrentView(view);
    });
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
