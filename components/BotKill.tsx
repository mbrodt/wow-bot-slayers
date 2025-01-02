import { useState } from "react";
import { Bot, MapPin, Sword, ThumbsUp, User, Play } from "lucide-react";
import { Button } from "./ui/button";
import useUser from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import type { BotKillT } from "./BotKillGrid";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function BotKill({ kill }: { kill: BotKillT }) {
  const [showVideo, setShowVideo] = useState(false);
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { toast } = useToast();
  const { data: user } = useUser();

  const { mutate } = useMutation({
    mutationKey: ["increment_votes", kill.id],
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("increment_votes", {
        row_id: kill.id,
        vote_user_id: user?.id,
      });
      if (error) throw error;
      return { data, id: kill.id };
    },
    onSuccess: (response) => {
      const { data, id } = response;

      if (data === null) {
        toast({
          title: "Authentication required",
          description: "Please log in to vote.",
        });
        return;
      }

      if (data === false) {
        toast({
          title: "Already voted",
          description: "You have already voted for this bot kill.",
          variant: "default",
        });
        return;
      }

      queryClient.setQueryData<BotKillT[]>(["bot-kills"], (oldKills) => {
        if (!oldKills) return [];

        const updated = oldKills.map((kill) =>
          kill.id === id
            ? {
                ...kill,
                votes: kill.votes + 1,
                user_has_voted: true,
              }
            : kill
        );
        queryClient.invalidateQueries({ queryKey: ["user-votes", user?.id] });

        return updated;
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId =
    kill.media_type === "youtube" ? getYouTubeVideoId(kill.media_url) : null;
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/0.jpg`
    : null;

  return (
    <div
      key={kill.id}
      className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden border-2 border-yellow-500 hover:border-green-400 transition-all duration-300 transform flex flex-col"
    >
      <div className="relative" style={{ paddingTop: "56.25%" }}>
        {kill.media_type === "image" ? (
          <img
            src={kill.media_url}
            alt={kill.bot_name}
            className="absolute top-0 left-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : kill.media_type === "youtube" ? (
          showVideo ? (
            <iframe
              src={`${kill.media_url}?autoplay=1`}
              title={kill.bot_name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          ) : (
            <button
              className="absolute top-0 left-0 w-full h-full"
              onClick={() => setShowVideo(true)}
            >
              <img
                src={thumbnailUrl || "/placeholder.webp"}
                alt={kill.bot_name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-60 rounded-full p-4">
                  <Play className="size-10 text-white" />
                </div>
              </div>
            </button>
          )
        ) : (
          <img
            src="/placeholder.webp"
            alt="Placeholder"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-6 relative flex flex-grow flex-col">
        <h2 className="text-2xl xl:text-3xl font-bold text-yellow-400 mb-4 font-wow border-b-2 border-yellow-500 pb-2  gap-4">
          <span>
            {kill.bot_name}{" "}
            <span className="text-lg">
              (Lvl {kill.bot_level}
              <Bot className="inline ml-1 -mt-1 h-5 w-5" />)
            </span>
          </span>
        </h2>
        <p className="text-gray-300 mb-4 italic flex-grow">
          {kill.description}
        </p>
        <div className="flex justify-between gap-4 items-end">
          <div className="flex items-center text-blue-400">
            <MapPin className="mr-2 h-5 w-5" />
            <span className="font-wow">{kill.zone}</span>
          </div>
          <div className="flex items-center text-green-400 gap-2">
            <span className="font-wow">{kill.profiles?.character_name}</span>
            <User className="mr-2 h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            onClick={() => mutate()}
            className={`${
              kill.user_has_voted
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-wow flex items-center px-6 py-3 rounded-full transition-colors duration-300`}
            disabled={kill.user_has_voted}
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
  );
}

export default BotKill;
