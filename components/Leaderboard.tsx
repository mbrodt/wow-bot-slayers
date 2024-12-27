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

function createLeaderboard(
  botKills: BotKill[],
  profiles: Profile[]
): LeaderboardEntry[] {
  const profileMap = new Map<string, string>(
    profiles.map((profile) => [profile.id, profile.character_name])
  );

  const leaderboard = botKills.reduce<LeaderboardEntry[]>((acc, kill) => {
    const characterName = profileMap.get(kill.user_id) || "Unknown";
    const existingEntry = acc.find(
      (entry) => entry.character_name === characterName
    );

    if (existingEntry) {
      existingEntry.bot_kills++;
      existingEntry.total_votes += kill.votes;
    } else {
      acc.push({
        user_id: kill.user_id,
        character_name: characterName,
        bot_kills: 1,
        total_votes: kill.votes,
      });
    }

    return acc;
  }, []);

  return leaderboard.sort(
    (a, b) => b.bot_kills - a.bot_kills || b.total_votes - a.total_votes
  );
}

async function fetchLeaderboardData(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  try {
    const { data: botKills, error: botKillsError } = await supabase
      .from("bot_kills")
      .select("id, user_id, votes");
    console.log("botKills:", botKills);
    if (botKillsError) throw botKillsError;

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, character_name");
    if (profilesError) throw profilesError;
    console.log("profiles:", profiles);

    const leaderboard = createLeaderboard(botKills || [], profiles || []);
    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
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
