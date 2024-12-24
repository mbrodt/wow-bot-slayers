"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

export default function Auth() {
  const { user, signIn, signOut, loading } = useUser();

  if (loading) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <Link
            href="/profile"
            className="text-white hover:text-yellow-400 transition-colors duration-300 font-wow"
          >
            Profile
          </Link>
          <Button onClick={signOut} variant="outline" className="font-wow">
            Sign Out
          </Button>
        </>
      ) : (
        <Button
          onClick={signIn}
          className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-wow"
        >
          Sign in with Discord
        </Button>
      )}
    </div>
  );
}
