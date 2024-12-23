import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "WoW Bot Slayer",
  description: "Track and submit World of Warcraft bot kills",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navigation />
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
