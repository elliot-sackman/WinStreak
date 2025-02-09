import { Separator } from "@/components/ui/separator";

interface ContestLayoutProps {
  children: React.ReactNode;
}

export default function ContestsLayout({ children }: ContestLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Contests</h3>
        <p className="text-sm text-muted-foreground">
          View active, past, and upcoming contests.
        </p>
      </div>
      <Separator />
      <div className="flex-1 mx-auto w-full md:max-w-5xl">{children}</div>
    </div>
  );
}
