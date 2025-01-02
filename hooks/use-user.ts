import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });
}
