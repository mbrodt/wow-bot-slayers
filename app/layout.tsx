import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import ServerSessionProvider from "@/components/ServerSessionProvider";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "WoW Bot Slayer",
  description: "Track and submit World of Warcraft bot kills",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  // Use getUser() instead of getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Create a session-like object from the user data
  const session = user
    ? {
        user,
        // Add other necessary session properties here
      }
    : null;

  return (
    <html lang="en">
      <body>
        <ServerSessionProvider initialSession={session}>
          <ToastProvider>
            <Navigation />
            {children}
            <Toaster />
          </ToastProvider>
        </ServerSessionProvider>
      </body>
    </html>
  );
}
