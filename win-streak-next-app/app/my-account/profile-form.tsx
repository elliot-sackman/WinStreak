"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const profileFormSchema = z.object({
  favorite_sport: z.string().max(50, {
    message: "Favorite sport must be less than 50 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

function formatBirthday(dateStr?: string) {
  if (!dateStr) return "";
  // Parse as local date to avoid timezone issues
  const [yyyy, mm, dd] = dateStr.split("-");
  if (!yyyy || !mm || !dd) return dateStr;
  return `${mm}-${dd}-${yyyy}`;
}

export function ProfileForm({ profile }: { profile: any }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form className="space-y-8">
        {/* Username (display_name) */}
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input value={profile?.display_name || ""} readOnly />
          </FormControl>
          <FormDescription>This is your public display name.</FormDescription>
        </FormItem>
        {/* Birthday */}
        <FormItem>
          <FormLabel>Birthday</FormLabel>
          <FormControl>
            <Input value={formatBirthday(profile?.birthday)} readOnly />
          </FormControl>
        </FormItem>
        {/* Email */}
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input value={profile?.email || ""} readOnly />
          </FormControl>
        </FormItem>
        <div>
          <Button asChild variant="secondary" className="mt-2">
            <Link href="/reset-password">Reset Password</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
