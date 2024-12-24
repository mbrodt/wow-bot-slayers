import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

interface Profile {
  character_name: string | null;
}

interface UserWithProfile extends User {
  profile?: Profile;
}

export function useUser() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("character_name")
            .eq("id", user.id)
            .single();

          if (profileError) throw profileError;

          setUser({ ...user, profile });
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        setUser(null);
      }

      setLoading(false);
    }

    loadUser();
  }, [supabase, session]);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, error, signIn, signOut };
}
