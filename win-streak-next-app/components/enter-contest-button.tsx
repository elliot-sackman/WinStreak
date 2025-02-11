"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EnterContestButtonProps {
  contestId: number;
  contestNameSlug: string;
  userId: string;
  userHasEntered: boolean;
}

const EnterContestButton: React.FC<EnterContestButtonProps> = function ({
  contestId,
  contestNameSlug,
  userId,
  userHasEntered,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleEnterContest = async () => {
    setLoading(true);

    const { error } = await supabase.from("entries").insert([
      {
        user_id: userId,
        contest_id: contestId,
      },
    ]);

    if (error) {
      console.error("Error entering contest:", error.message);
      setLoading(false);
      return;
    } else {
      toast({
        title: "Success!",
        description: "You have successfully entered the contest.",
      });
    }

    // Redirect to contests page after successful entry
    router.push(`/contests/${contestNameSlug}`);
  };

  const handleRedirectOnly = () => {
    router.push(`/contests/${contestNameSlug}`);
  };

  return (
    <Button
      variant="enter"
      onClick={userHasEntered ? handleRedirectOnly : handleEnterContest}
      disabled={loading}
    >
      {userHasEntered
        ? "View Contest Details"
        : loading
          ? "Entering..."
          : "Enter Contest"}
    </Button>
  );
};

export { EnterContestButton };
