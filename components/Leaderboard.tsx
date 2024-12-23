"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BotKill {
  id: number;
  user_id: string;
  votes: number;
}

interface Profile {
  id: string;
  character_name: string;
}

interface LeaderboardEntry {
  user_id: string;
  character_name: string;
  bot_kills: number;
  total_votes: number;
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  async function fetchLeaderboardData() {
    setIsLoading(true);
    setError(null);
    try {
      const { data: botKills, error: botKillsError } = await supabase
        .from("bot_kills")
        .select("id, user_id, votes");

      if (botKillsError) throw botKillsError;

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, character_name");

      if (profilesError) throw profilesError;

      const leaderboard = createLeaderboard(botKills, profiles);
      setLeaderboardData(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setError("Failed to load leaderboard data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  function createLeaderboard(
    botKills: BotKill[],
    profiles: Profile[]
  ): LeaderboardEntry[] {
    const userMap = new Map<string, LeaderboardEntry>();

    botKills.forEach((kill) => {
      if (!userMap.has(kill.user_id)) {
        userMap.set(kill.user_id, {
          user_id: kill.user_id,
          character_name: "Unknown",
          bot_kills: 0,
          total_votes: 0,
        });
      }
      const entry = userMap.get(kill.user_id)!;
      entry.bot_kills++;
      entry.total_votes += kill.votes;
    });

    profiles.forEach((profile) => {
      if (userMap.has(profile.id)) {
        userMap.get(profile.id)!.character_name = profile.character_name;
      }
    });

    return Array.from(userMap.values()).sort(
      (a, b) => b.bot_kills - a.bot_kills || b.total_votes - a.total_votes
    );
  }

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Character Name</TableHead>
          <TableHead className="text-right">Bots Killed</TableHead>
          <TableHead className="text-right">Total Votes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboardData.map((entry, index) => (
          <TableRow key={entry.user_id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{entry.character_name}</TableCell>
            <TableCell className="text-right">{entry.bot_kills}</TableCell>
            <TableCell className="text-right">{entry.total_votes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
