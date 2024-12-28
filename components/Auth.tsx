import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import SignOutButton from "./SignOutButton";
import SignInButton from "./SignInButton";

export default async function Auth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex items-center space-x-6">
      {user ? (
        <>
          <Link
            href="/profile"
            className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-lg font-wow"
          >
            Profile
          </Link>
          <SignOutButton />
        </>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
