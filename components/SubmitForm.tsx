"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function SubmitForm({ user }: { user: any }) {
  const supabase = createClient();
  const [formData, setFormData] = useState({
    bot_name: "",
    description: "",
    zone: "",
    mediaType: "image",
    image: null as File | null,
    youtubeLink: "",
    bot_level: 1,
    server_region: "EU",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a bot kill.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      let mediaUrl =
        formData.mediaType === "youtube"
          ? convertYouTubeUrl(formData.youtubeLink)
          : formData.youtubeLink;

      if (formData.mediaType === "image" && formData.image) {
        const file = formData.image;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;

        // Create a new File object with a proper name
        const renamedFile = new File([file], fileName, { type: file.type });

        const { error } = await supabase.storage
          .from("screenshots")
          .upload(fileName, renamedFile);

        if (error) {
          throw new Error(`Error uploading file: ${error.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("screenshots").getPublicUrl(fileName);

        mediaUrl = publicUrl;
      }

      const { error } = await supabase.from("bot_kills").insert([
        {
          bot_name: formData.bot_name,
          description: formData.description,
          zone: formData.zone,
          media_type: formData.mediaType,
          media_url: mediaUrl,
          user_id: user.id,
          bot_level: formData.bot_level,
          server_region: formData.server_region,
        },
      ]);

      if (error) {
        console.error("Full error object:", error);
        throw new Error(`Error submitting bot kill: ${error.message}`);
      }

      router.push("/submit-success?level=" + formData.bot_level);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleMediaTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, mediaType: value }));
  };

  const convertYouTubeUrl = (url: string): string => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1] || url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 bg-opacity-75 p-6 rounded-lg shadow-lg mb-8"
    >
      <h2 className="text-2xl font-wow text-yellow-400 mb-4">
        Submit a Bot Kill
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="bot_name"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Bot Name
          </label>
          <Input
            id="bot_name"
            name="bot_name"
            value={formData.bot_name}
            onChange={handleChange}
            required
            className="bg-gray-700 text-white"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="bg-gray-700 text-white"
          />
        </div>
        <div>
          <label
            htmlFor="zone"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Zone
          </label>
          <Select
            value={formData.zone}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, zone: value }))
            }
          >
            <SelectTrigger className="bg-gray-700 text-white">
              <SelectValue placeholder="Select a zone" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Alterac Mountains",
                "Arathi Highlands",
                "Ashenvale",
                "Azshara",
                "Badlands",
                "Barrens",
                "Blasted Lands",
                "Burning Steppes",
                "Darkshore",
                "Deadwind Pass",
                "Desolace",
                "Dustwallow Marsh",
                "Dun Morogh",
                "Durotar",
                "Duskwood",
                "Eastern Plaguelands",
                "Elwynn Forest",
                "Feralas",
                "Felwood",
                "Hillsbrad Foothills",
                "Hinterlands",
                "Loch Modan",
                "Moonglade",
                "Mulgore",
                "Redridge Mountains",
                "Searing Gorge",
                "Silithus",
                "Silverpine Forest",
                "Stonetalon Mountains",
                "Stranglethorn Vale",
                "Swamp of Sorrows",
                "Tanaris",
                "Teldrassil",
                "Thousand Needles",
                "Tirisfal Glades",
                "Un'Goro Crater",
                "Western Plaguelands",
                "Westfall",
                "Wetlands",
                "Winterspring",
              ].map((zone) => (
                <SelectItem key={zone} value={zone}>
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label
            htmlFor="bot_level"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Bot Level
          </label>
          <Slider
            id="bot_level"
            min={1}
            max={60}
            step={1}
            value={[formData.bot_level]}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, bot_level: value[0] }))
            }
            className="w-full"
          />
          <span className="text-sm text-gray-400 mt-1">
            Level: {formData.bot_level}
          </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Region
          </label>
          <RadioGroup
            value={formData.server_region}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, server_region: value }))
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="EU" id="eu" />
              <Label htmlFor="eu">EU (Soulseeker)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NA" id="na" />
              <Label htmlFor="na">NA (Doomhowl)</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Proof Type
          </label>
          <RadioGroup
            defaultValue="image"
            onValueChange={handleMediaTypeChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="image" id="image" />
              <Label htmlFor="image">Screenshot</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="youtube" id="youtube" />
              <Label htmlFor="youtube">YouTube Video</Label>
            </div>
          </RadioGroup>
        </div>
        {formData.mediaType === "image" ? (
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Screenshot
            </label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="bg-gray-700"
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor="youtubeLink"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              YouTube Link
            </label>
            <Input
              id="youtubeLink"
              name="youtubeLink"
              value={formData.youtubeLink}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="bg-gray-700 text-white"
            />
          </div>
        )}
      </div>
      <Button
        type="submit"
        className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-wow"
        disabled={!user || isSubmitting}
      >
        {isSubmitting
          ? "Submitting..."
          : user
          ? "Submit Bot Kill"
          : "Please Log In to Submit"}
      </Button>
    </form>
  );
}
