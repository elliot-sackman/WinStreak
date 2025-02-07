import { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/sidebar-nav";

export const metadata: Metadata = {
  title: "Contests",
  description: "View active, upcoming, and past contests.",
};

const sidebarNavItems = [
  {
    title: "All Contests",
    href: "/contests/",
  },
  {
    title: "My Contests",
    href: "/contests/my-contests",
  },
  {
    title: "Active Contests",
    href: "/contests/active",
  },
  {
    title: "Previous Contests",
    href: "/contests/previous",
  },
  {
    title: "Upcoming Contests",
    href: "/contests/upcoming",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">All things contests</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="mx-auto w-full lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 mx-auto w-full lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
