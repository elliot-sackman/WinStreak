"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ViewContestDetailsButtonProps {
  contestNameSlug: string;
}

const ViewContestDetailsButton: React.FC<ViewContestDetailsButtonProps> =
  function ({ contestNameSlug }) {
    const router = useRouter();

    const handleViewContestDetails = async () => {
      // Redirect to contests page after successful entry
      router.push(`/contests/${contestNameSlug}`);
    };

    return (
      <Button
        className="w-full my-1"
        variant="outline"
        onClick={handleViewContestDetails}
      >
        View Contest
      </Button>
    );
  };

export { ViewContestDetailsButton };
