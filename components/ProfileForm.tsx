"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";

export default function ProfileForm() {
  const [characterName, setCharacterName] = useState("");
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setCharacterName(user?.profile?.character_name || "");
    }
    setIsLoading(false);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, character_name: characterName });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 bg-opacity-75 p-6 rounded-lg shadow-lg mb-8"
    >
      <div className="mb-4">
        <label
          htmlFor="characterName"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          Character Name
        </label>
        <Input
          id="characterName"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          className="bg-gray-700 text-white"
        />
      </div>
      <Button
        type="submit"
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-wow"
      >
        Update Profile
      </Button>
    </form>
  );
}
