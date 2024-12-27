import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";

interface BotKill {
  id: number;
  character_name: string;
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
function createLeaderboard(
  botKills: BotKill[],
  profiles: Profile[]
): LeaderboardEntry[] {
  const characterMap = new Map<string, LeaderboardEntry>();

  botKills.forEach((kill) => {
    if (!characterMap.has(kill.character_name)) {
      characterMap.set(kill.character_name, {
        user_id: "",
        character_name: kill.character_name,
        bot_kills: 0,
        total_votes: 0,
      });
    }
    const entry = characterMap.get(kill.character_name)!;
    entry.bot_kills++;
    entry.total_votes += kill.votes;
  });

  profiles.forEach((profile) => {
    if (characterMap.has(profile.character_name)) {
      characterMap.get(profile.character_name)!.user_id = profile.id;
    }
  });

  return Array.from(characterMap.values()).sort(
    (a, b) => b.bot_kills - a.bot_kills || b.total_votes - a.total_votes
  );
}

async function fetchLeaderboardData() {
  const supabase = await createClient();
  try {
    const { data: botKills, error: botKillsError } = await supabase
      .from("bot_kills")
      .select("id, character_name, votes");
    if (botKillsError) throw botKillsError;

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, character_name");

    if (profilesError) throw profilesError;

    const leaderboard = createLeaderboard(botKills, profiles);
    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
  }
}

export default async function Leaderboard() {
  const leaderboardData = (await fetchLeaderboardData()) || [];

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
          <TableRow key={entry.character_name}>
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
