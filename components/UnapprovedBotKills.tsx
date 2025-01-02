"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

interface BotKill {
  id: number;
  bot_name: string;
  description: string;
  zone: string;
  is_approved: boolean | null;
  media_type: "image" | "youtube";
  media_url: string;
  profiles?: { character_name?: string } | null;
}

export default function UnapprovedBotKills() {
  const [unapprovedKills, setUnapprovedKills] = useState<BotKill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchUnapprovedKills();
  }, []);

  async function fetchUnapprovedKills() {
    const { data, error } = await supabase
      .from("bot_kills")
      .select(
        `
          id,
          bot_name,
          media_type,
          media_url,
          description,
          zone,
          created_at,
          profiles (character_name)
        `
      )
      .is("is_approved", null);

    if (error) {
      console.error("Error fetching unapproved kills:", error);
    } else {
      // @ts-expect-error i dont care
      setUnapprovedKills(data || []);
    }
    setIsLoading(false);
  }

  async function handleApprove(id: number) {
    const { error } = await supabase
      .from("bot_kills")
      .update({ is_approved: true })
      .eq("id", id);

    if (error) {
      console.error("Error approving kill:", error);
    } else {
      setUnapprovedKills((prev) => prev.filter((kill) => kill.id !== id));
    }
  }

  async function handleDeny(id: number) {
    const { error } = await supabase
      .from("bot_kills")
      .update({ is_approved: false })
      .eq("id", id);

    if (error) {
      console.error("Error denying kill:", error);
    } else {
      setUnapprovedKills((prev) => prev.filter((kill) => kill.id !== id));
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin: Unapproved Bot Kills</h1>
      {unapprovedKills.length === 0 ? (
        <p>No unapproved kills to review.</p>
      ) : (
        <ul className="space-y-4">
          {unapprovedKills.map((kill) => (
            <li
              key={kill.id}
              className="bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{kill.bot_name}</h2>

                <p className="text-gray-400">{kill.description}</p>
                <p className="text-sm text-blue-400">Zone: {kill.zone}</p>
                <p className="text-green-400">
                  Slain by {kill.profiles?.character_name}
                </p>
                {kill.media_url && (
                  <div className="mt-2 underline text-yellow-400 hover:text-yellow-300">
                    {kill.media_type === "youtube" ? (
                      <a
                        href={kill.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View YouTube Video
                      </a>
                    ) : (
                      <a
                        href={kill.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Image
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  onClick={() => handleApprove(kill.id)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleDeny(kill.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Deny
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
