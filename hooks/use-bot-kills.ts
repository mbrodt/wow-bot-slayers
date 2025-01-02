import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useBotKills() {
  return useQuery({
    queryKey: ["bot-kills"],
    queryFn: async () => {
      const supabase = await createClient();
      const { data: botKills } = await supabase
        .from("bot_kills")
        .select(
          `
        id,
        bot_name,
        description,
        zone,
        media_type,
        media_url,
        votes,
        created_at,
        bot_level,
        server_region,
        profiles (character_name)
      `
        )
        .eq("is_approved", true);
      return botKills;
    },
  });
}
