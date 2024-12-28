"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ThumbsUp,
  MapPin,
  Sword,
  User,
  Bot,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BotKill {
  id: number;
  bot_name: string;
  media_type: "image" | "youtube";
  media_url: string;
  description: string;
  zone: string;
  votes: number;
  created_at: string;
  user_has_voted: boolean;
  bot_level: number;
  profiles?: { character_name?: string } | null;
}

type SortOption = "recent" | "votes";

export default function BotKillGrid({ user }: { user: any }) {
  const supabase = createClient();
  const { toast } = useToast();
  const [botKills, setBotKills] = useState<BotKill[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchBotKills();
  }, [sortBy, sortOrder]);

  async function fetchBotKills() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let query = supabase
        .from("bot_kills")
        .select(
          `
          id,
          bot_name,
          media_type,
          media_url,
          description,
          zone,
          votes,
          created_at,
          bot_level,
          profiles (character_name)
        `
        )
        .eq("is_approved", true);

      if (sortBy === "recent") {
        query = query.order("created_at", { ascending: sortOrder === "asc" });
      } else if (sortBy === "votes") {
        query = query.order("votes", { ascending: sortOrder === "asc" });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching bot kills:", error);
        toast({
          title: "Error",
          description: "Failed to load bot kills. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const botKills = data || [];
      const userVotes = user ? await fetchUserVotes(user.id) : new Set();

      const processedData = botKills.map((kill) => ({
        ...kill,
        user_has_voted: userVotes.has(kill.id),
        media_url: kill.media_url
          ? convertYouTubeUrl(kill.media_url)
          : "/placeholder.webp",
      }));
      // @ts-expect-error i dont care
      setBotKills(processedData);
    } catch (error) {
      console.error("Error in fetchBotKills:", error);
      toast({
        title: "Error",
        description: "An error occurred while loading bot kills.",
        variant: "destructive",
      });
    }
  }

  async function fetchUserVotes(userId: string): Promise<Set<number>> {
    const { data, error } = await supabase
      .from("user_votes")
      .select("bot_kill_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user votes:", error);
      return new Set();
    }

    return new Set(data.map((vote) => vote.bot_kill_id));
  }

  const handleVote = async (id: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc("increment_votes", {
        row_id: id,
        vote_user_id: user.id,
      });

      if (error) throw error;

      if (data) {
        setBotKills((prevKills) =>
          prevKills.map((kill) =>
            kill.id === id
              ? { ...kill, votes: kill.votes + 1, user_has_voted: true }
              : kill
          )
        );
      } else {
        toast({
          title: "Already voted",
          description: "You have already voted for this bot kill.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const convertYouTubeUrl = (url: string): string => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1] || url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Select
          value={sortBy}
          onValueChange={(value: SortOption) => setSortBy(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="votes">Most Votes</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={toggleSortOrder} variant="default">
          {sortOrder === "asc" ? <SortAsc /> : <SortDesc />}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {botKills.map((kill) => (
          <div
            key={kill.id}
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden border-2 border-yellow-500 hover:border-green-400 transition-all duration-300 transform hover:scale-105 will-change-transform"
          >
            <div className="aspect-video relative">
              {kill.media_type === "image" ? (
                <Image
                  src={kill.media_url}
                  alt={kill.bot_name}
                  fill
                  className="object-cover"
                  sizes="100%"
                />
              ) : kill.media_type === "youtube" ? (
                <iframe
                  src={kill.media_url}
                  title={kill.bot_name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <Image
                  src="/placeholder.webp"
                  alt="Placeholder"
                  fill
                  className="object-cover"
                  sizes="100%"
                />
              )}
            </div>
            <div className="p-6 relative">
              <h2 className="text-2xl xl:text-3xl font-bold text-yellow-400 mb-4 font-wow border-b-2 border-yellow-500 pb-2  gap-4">
                <span>
                  {kill.bot_name}{" "}
                  <span className="text-lg">
                    (Lvl {kill.bot_level}
                    <Bot className="inline ml-1 -mt-1 h-5 w-5" />)
                  </span>
                </span>
              </h2>
              <p className="text-gray-300 mb-4 italic">{kill.description}</p>
              <div className="flex justify-between gap-4 mb-4">
                <div className="flex items-center text-blue-400">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span className="font-wow">{kill.zone}</span>
                </div>
                <div className="flex items-center text-green-400 gap-2">
                  <span className="font-wow">
                    {kill.profiles?.character_name}
                  </span>
                  <User className="mr-2 h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button
                  onClick={() => handleVote(kill.id)}
                  className={`${
                    kill.user_has_voted
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white font-wow flex items-center px-6 py-3 rounded-full transition-colors duration-300`}
                  disabled={!user || kill.user_has_voted}
                >
                  <ThumbsUp className="mr-2 h-5 w-5" />
                  {kill.user_has_voted ? "Voted" : "Vote"}
                </Button>
                <div className="flex items-center text-yellow-400 font-wow gap-2">
                  <div>
                    <span className="text-2xl font-bold">{kill.votes}</span>
                    <span className="text-sm ml-1">votes</span>
                  </div>
                  <Sword className="mr-2 h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
