import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface Profile {
  character_name: string | null;
}

interface UserWithProfile extends User {
  profile?: Profile;
}

export function useUser() {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        setError(null);

        if (session?.user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("character_name")
              .eq("id", session.user.id)
              .single();

            if (profileError) throw profileError;

            setUser({ ...session.user, profile });
          } catch (err) {
            setError(
              err instanceof Error
                ? err
                : new Error("An unknown error occurred")
            );
            setUser(session.user);
          }
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
