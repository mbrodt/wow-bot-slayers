"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";

function SignOutButton() {
  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };
  return (
    <Button
      onClick={signOut}
      variant="outline"
      className="font-wow md:text-base"
    >
      Sign Out
    </Button>
  );
}

export default SignOutButton;
