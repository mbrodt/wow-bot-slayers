"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";

function SignInButton() {
  const supabase = createClient();

  const signIn = async () => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo,
      },
    });
  };

  return (
    <Button
      onClick={signIn}
      className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-wow"
    >
      Sign in with Discord
    </Button>
  );
}

export default SignInButton;
