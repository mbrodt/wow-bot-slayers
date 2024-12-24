"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function ServerSessionProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: any;
}) {
  const [supabaseClient] = useState(() => createClientComponentClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  );
}
