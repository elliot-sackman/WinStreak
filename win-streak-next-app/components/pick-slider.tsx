"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const PickSlider = ({
  gameId,
  homeTeam,
  awayTeam,
  //onPickChange,
}: {
  gameId: number;
  homeTeam: string;
  awayTeam: string;
  //onPickChange: (gameId: string, team: string) => void
}) => {
  const [pick, setPick] = useState<string>("none");

  const handlePick = (direction: string) => {
    setPick(direction);
    //onPickChange(gameId, direction)
  };

  return (
    <div className="space-y-2 py-2">
      <Tabs value={pick || "none"} onValueChange={handlePick}>
        <TabsList className="max-w-5xl w-full text-center">
          {/* Home Team Tab */}
          <TabsTrigger
            value="home"
            className="flex-1 py-1 text-center font-semibold  data-[state=active]:bg-green-600/70 data-[state=active]:text-white data-[state=active]:shadow"
          >
            {homeTeam}
          </TabsTrigger>

          {/* No Pick Tab */}
          <TabsTrigger value="none" className="w-1/4 py-1 text-center">
            No Pick
          </TabsTrigger>

          {/* Away Team Tab */}
          <TabsTrigger
            value="away"
            className="flex-1 py-1 font-semibold data-[state=active]:bg-green-600/70 data-[state=active]:text-white data-[state=active]:shadow"
          >
            {awayTeam}
          </TabsTrigger>
        </TabsList>

        {/* Home Team Content */}
        <TabsContent value="home">Your Pick: {homeTeam}</TabsContent>

        {/* No Pick Content */}
        <TabsContent value="none">No Pick Made</TabsContent>

        {/* Away Team Content */}
        <TabsContent value="away">Your Pick: {awayTeam}</TabsContent>
      </Tabs>
      <Separator />
    </div>
  );
};

export { PickSlider };
