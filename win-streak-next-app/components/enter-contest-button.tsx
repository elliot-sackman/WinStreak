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

    const { error } = await supabase.from("entries").insert([
      {
        user_id: userId,
        contest_id: contest.contest_id,
      },
    ]);

    if (error) {
      console.error("Error entering contest:", error.message);
      setLoading(false);
      return;
    } else {
      var description = "You have successfully entered the contest!";

      if (contest.sponsor_id && contest.sponsor_promo) {
        description =
          description +
          `\nBy entering this contest, you've earned a special offer from ${contest.sponsor_name}.\n${contest.sponsor_promo}`;
      }
      toast({
        title: "Success!",
        description,
      });
    }

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
