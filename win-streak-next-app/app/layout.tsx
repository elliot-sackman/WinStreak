import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Image from "next/image";
import winStreakLogo from "./win-streak-logo.png";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import MainMenu from "@/components/main-menu";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "WinStreak Sports",
  description: "Where sports fans build a streak and win big!",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="bg-background text-foreground overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-5 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href="/">
                      <Image
                        src={winStreakLogo}
                        alt="Win Streak Logo"
                        width={50}
                        height={50}
                        quality={25}
                      />
                    </Link>
                  </div>

                  <MainMenu user={user} />
                </div>
              </nav>
              <div className="flex flex-col gap-5 container mx-auto px-2 sm:px-4 md:px-10 lg:px-20">
                <Toaster />
                {children}
                <Analytics />
                <SpeedInsights />
              </div>

              <footer className="w-full flex flex-col items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16 max-w-md px-4">
                <div>
                  <span className="font-semibold">
                    NO PURCHASE NECESSARY TO ENTER OR WIN.
                  </span>{" "}
                  Open to legal residents of the United States who are
                  registered users of WinStreakSports.com and age 18+. Must be
                  21+ to win prizes.
                </div>
                <div className="flex gap-4 mt-2">
                  <Link
                    href="/terms"
                    className="underline hover:text-primary transition-colors"
                  >
                    terms of use
                  </Link>
                  <span>|</span>
                  <Link
                    href="/privacy-policy"
                    className="underline hover:text-primary transition-colors"
                  >
                    privacy policy
                  </Link>
                </div>
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
