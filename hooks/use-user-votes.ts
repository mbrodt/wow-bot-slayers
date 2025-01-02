import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useUserVotes(userId?: string) {
  return useQuery({
    queryKey: ["user-votes", userId],
    queryFn: async () => {
      if (!userId) {
        return new Set();
      }
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("user_votes")
        .select("bot_kill_id")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user votes:", error);
        return new Set();
      }

      return new Set(data.map((vote) => vote.bot_kill_id));
    },
  });
}
