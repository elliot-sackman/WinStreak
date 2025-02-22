"use client";

import {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "./ui/button";
import { MenuIcon, ArrowDownIcon } from "lucide-react";
import { signOutAction } from "@/app/actions";
import { User } from "@supabase/supabase-js";

export default function MainMenu({ user }: { user: User | null }) {
  return (
    <div className="flex items-center justify-between gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          Hey, {user.user_metadata.username}!
        </div>
      ) : (
        <div className="flex gap-2">
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant={"default"}>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      )}
      <Sheet>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">WinStreak Sports</SheetTitle>
            <SheetDescription className="text-left">
              Play to win
            </SheetDescription>
          </SheetHeader>

          <div className="text-left my-2">
            <SheetClose asChild>
              <Link href={"/"}>Home</Link>
            </SheetClose>
          </div>

          <div className="text-left my-2">
            <SheetClose asChild>
              <Link href={"/dashboard"}>Dashboard</Link>
            </SheetClose>
          </div>

          <div className="my-2">
            <SheetClose asChild>
              <Link href={"/contests"}>Contests</Link>
            </SheetClose>
          </div>
          <div className="my-2">
            <SheetClose asChild>
              <Link href={"/my-account"}>My Account</Link>
            </SheetClose>
          </div>
          <div className="my-2">
            <SheetClose asChild>
              <Link href={"/my-picks"}>My Picks</Link>
            </SheetClose>
          </div>
          {user ? (
            <div className="my-2" onClick={signOutAction}>
              <SheetClose asChild>
                <Link href={"/sign-in"}>Logout</Link>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="my-2">
                <SheetClose asChild>
                  <Link href={"/sign-in"}>Login</Link>
                </SheetClose>
              </div>
              <div className="my-2">
                <SheetClose asChild>
                  <Link href={"/sign-up"}>Sign Up</Link>
                </SheetClose>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
