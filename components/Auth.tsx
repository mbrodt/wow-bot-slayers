"use client";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import SignInButton from "./SignInButton";
import useUser from "@/hooks/use-user";

export default function AuthContent() {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  return user ? (
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
  );
}
