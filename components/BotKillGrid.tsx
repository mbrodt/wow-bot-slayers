"use client";

import { useState, useMemo } from "react";
import { SortAsc, SortDesc, ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useBotKills from "@/hooks/use-bot-kills";
import useUser from "@/hooks/use-user";
import useUserVotes from "@/hooks/use-user-votes";
import BotKill from "./BotKill";

export type BotKillT = {
  id: number;
  bot_name: string;
  media_type: "image" | "youtube";
  media_url: string;
  description: string;
  zone: string;
  votes: number;
  created_at: string;
  user_has_voted?: boolean;
  bot_level: number;
  server_region?: string;
  profiles?: { character_name?: string } | null;
};

type SortOption = "recent" | "votes";

const KILLS_PER_PAGE = 18;

function convertYouTubeUrl(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.split("v=")[1] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

export default function BotKillGrid() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: user } = useUser();
  const {
    data: queryBotKills,
    isLoading: isLoadingBotKills,
    error,
  } = useBotKills();
  const { data: userVoteSet, isLoading: isLoadingVotes } = useUserVotes(
    user?.id
  );

  // 1) Derive kills with processed media URLs
  // @ts-expect-error - queryBotKills is possibly undefined
  const processedBotKills = useMemo<BotKillT[]>(() => {
    if (!queryBotKills) return [];

    return queryBotKills.map((kill) => ({
      ...kill,
      media_url: kill.media_url
        ? convertYouTubeUrl(kill.media_url)
        : "/placeholder.webp",
    }));
  }, [queryBotKills]);

  // 2) Add in user_has_voted info (only if we have user votes)
  const killsWithUserVote = useMemo<BotKillT[]>(() => {
    if (!processedBotKills.length) return [];
    if (!userVoteSet) {
      // If votes aren't loaded yet, just return kills without user_has_voted
      return processedBotKills;
    }

    // userVoteSet is presumably a Set of kill IDs the user has voted for
    return processedBotKills.map((kill) => ({
      ...kill,
      user_has_voted: userVoteSet.has(kill.id),
    }));
  }, [processedBotKills, userVoteSet]);

  // 3) Sort kills
  const sortedKills = useMemo<BotKillT[]>(() => {
    // Make a shallow copy first
    const kills = [...killsWithUserVote];

    kills.sort((a, b) => {
      if (sortBy === "recent") {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      } else {
        // sortBy === 'votes'
        return sortOrder === "asc" ? a.votes - b.votes : b.votes - a.votes;
      }
    });
    return kills;
  }, [killsWithUserVote, sortBy, sortOrder]);

  // 4) Slice for pagination
  const totalPages = useMemo(() => {
    if (!sortedKills.length) return 1;
    return Math.ceil(sortedKills.length / KILLS_PER_PAGE);
  }, [sortedKills]);

  const paginatedKills = useMemo<BotKillT[]>(() => {
    const startIndex = (currentPage - 1) * KILLS_PER_PAGE;
    return sortedKills.slice(startIndex, startIndex + KILLS_PER_PAGE);
  }, [sortedKills, currentPage]);

  if (isLoadingBotKills || isLoadingVotes) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error("Error fetching bot kills:", error);
    toast({
      title: "Error",
      description: "Failed to load bot kills. Please try again.",
      variant: "destructive",
    });
    return null;
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div>
      {/* Sort Controls */}
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

      {/* Kills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {paginatedKills.map((kill) => (
          <BotKill key={kill.id} kill={kill} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mx-auto flex items-center justify-center">
        <Button
          variant={"link"}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ArrowLeftIcon className="h-6 w-6" />
          Previous
        </Button>
        <span className="mx-4 text-yellow-400 font-wow">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant={"link"}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
          <ArrowRightIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
