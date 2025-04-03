"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Contest } from "@/lib/types";

interface EnterContestButtonProps {
  contest: Contest;
  userId: string;
}

const EnterContestButton: React.FC<EnterContestButtonProps> = function ({
  contest,
  userId,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleEnterContest = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("enter_contest", {
      curr_user_id: userId,
      curr_contest_id: contest.contest_id,
    });

    if (error) {
      console.error("Error entering contest:", error.message);
      toast({
        title: "Error",
        description: error.message,
      });
      setLoading(false);
      return;
    }

    if (data === "User already has an active entry in this contest.") {
      toast({
        title: "Error",
        description: "You already have an active entry in this contest.",
      });
      setLoading(false);
      return;
    }

    if (data === "Contest is not in progress.") {
      toast({
        title: "Error",
        description: "This contest is not currently in progress.",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Success!",
      description: "You have successfully entered the contest!",
    });

    // Redirect to contests page after successful entry
    router.push(`/contests/${contest.contest_name_slug}`);
  };

  return (
    <Button
      className="w-full my-1"
      variant="enter"
      onClick={handleEnterContest}
      disabled={loading}
    >
      {loading ? "Entering..." : "Enter Contest"}
    </Button>
  );
};

export { EnterContestButton };
