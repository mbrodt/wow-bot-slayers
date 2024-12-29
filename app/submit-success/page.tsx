"use client";

import { useSearchParams } from "next/navigation";
import { Clock, DollarSign, Coins, Sparkles } from "lucide-react";
import JSConfetti from "js-confetti";
import { Suspense, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { calculateBotSetback } from "@/lib/utils";

function SubmitSuccessPage() {
  return (
    <Suspense>
      <SubmitSuccess />
    </Suspense>
  );
}

function SubmitSuccess() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const searchParams = useSearchParams();
  const level = Number(searchParams.get("level"));
  const result = calculateBotSetback(level);

  useEffect(() => {
    const jsConfetti = new JSConfetti();

    jsConfetti.addConfetti({
      confettiColors: ["#facc15", "#93c5fd", "#4ade80"],
    });
    audioRef.current?.play();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow container mx-auto px-4 py-12">
        <audio ref={audioRef} src="/quest_complete.mp3"></audio>
        <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-90 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-yellow-400 mb-8 font-wow">
            Thank you for your service!
          </h1>
          <p className="text-xl text-center mb-8 text-blue-300">
            By slaying a bot at level {level}, you have successfully:
          </p>
          <ul className="space-y-6">
            <li className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg">
              <div className="bg-blue-500 p-3 rounded-full">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg">
                Set the botters back by{" "}
                <strong className="text-yellow-400">
                  {result.timeSetBackHours} hours
                </strong>
              </span>
            </li>
            <li className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg">
              <div className="bg-green-500 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg">
                Cost the bot operators{" "}
                <strong className="text-yellow-400">
                  ${result.dollarSetBack}
                </strong>{" "}
              </span>
            </li>
            <li className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg">
              <div className="bg-yellow-500 p-3 rounded-full">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg">
                Set the botters back by{" "}
                <strong className="text-yellow-400">
                  {result.goldSetBack} gold
                </strong>
              </span>
            </li>
            <li className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg">
              <div className="bg-purple-500 p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg">
                Helped to keep Azeroth clean and safe for all players
              </span>
            </li>
          </ul>
          <div className="mt-12 text-center">
            <p className="text-2xl font-wow text-green-400">
              The Alliance and Horde salute you, hero!
            </p>
            <p className="mt-4 text-lg text-blue-300 px-16">
              Your kill will show up on the Wall of Slain and in the Leaderboard
              once it has been approved by an admin
            </p>
            <Button
              asChild
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-wow"
            >
              <Link href="/submit">Submit another kill</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SubmitSuccessPage;
