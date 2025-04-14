import { FormMessage, Message } from "@/components/form-message";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import SignupForm from "./components/signup-form";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles_public")
    .select("display_name");

  const profileObjects = data as { display_name: string }[] | null;
  const allUserNames: string[] = [];
  profileObjects?.forEach((profile) => allUserNames.push(profile.display_name));

  return (
    <div className="w-full">
      <div className="flex flex-col min-w-64 max-w-64 mx-auto mb-2">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
      <SignupForm
        searchParams={searchParams}
        existingUsernames={allUserNames}
      />
    </div>
  );
}
