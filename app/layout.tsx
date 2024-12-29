import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Auth from "@/components/Auth";

const url = "https://wow-bot-slayer.vercel.app";

export const metadata: Metadata = {
  title: {
    template: "%s | HCCC",
    default: "Hardcore Cleaning Crew",
  },
  description:
    "Track kills, climb leaderboards, and strike back against botters with your most epic takedowns. Share your victories and become a legend in the fight for a cleaner Azeroth",
  openGraph: {
    title: "Join the Hardcore Cleaning Crew",
    description:
      "Track kills, climb leaderboards, and strike back against botters with your most epic takedowns. Share your victories and become a legend in the fight for a cleaner Azeroth",
    url: url,
    siteName: "Hardcore Cleaning Crew",
    images: [
      {
        url: `${url}/logo.png`,
        width: 600,
        height: 600,
      },
    ],

    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navigation>
            <Auth />
          </Navigation>
          {children}
          <Toaster />
        </ToastProvider>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="950c50a9-b307-49e5-80d2-bffe43f7e278"
        />
      </body>
    </html>
  );
}
