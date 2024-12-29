"use client";

import { useSearchParams } from "next/navigation";
import { Clock, DollarSign, Coins, Sparkles } from "lucide-react";
import JSConfetti from "js-confetti";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BotSetbackResult {
  level: number;
  timeSetBackHours: number;
  dollarSetBack: number;
  goldSetBack: number;
}

function calculateBotSetback(
  level: number,
  monthlyRevenue: number = 250,
  hoursPerDay: number = 18,
  goldConversionRate: number = 10
): BotSetbackResult {
  // Constants
  const daysPerMonth = 30;
  const hoursPerMonth = hoursPerDay * daysPerMonth;
  const hourlyIncome = monthlyRevenue / hoursPerMonth; // Revenue per hour
  const dollarsToGoldRatio = 100 / goldConversionRate; // Conversion from dollars to gold

  // Leveling data (Example cumulative playtime in hours per level)
  const levelingData: Record<number, number> = {
    1: 0.25,
    2: 0.5,
    3: 0.75,
    4: 1,
    5: 1.5,
    6: 1.75,
    7: 2,
    8: 2.5,
    9: 3,
    10: 3.5,
    11: 4,
    12: 4.5,
    13: 5,
    14: 5.75,
    15: 6.5,
    16: 7.5,
    17: 8.25,
    18: 9,
    19: 10,
    20: 11,
    21: 12,
    22: 13,
    23: 14.5,
    24: 16,
    25: 17.5,
    26: 19,
    27: 21,
    28: 23,
    29: 25,
    30: 27,
    31: 30,
    32: 32,
    33: 35,
    34: 38,
    35: 41,
    36: 44.5,
    37: 48.5,
    38: 52.5,
    39: 57,
    40: 62,
    41: 67,
    42: 72.75,
    43: 78.5,
    44: 85,
    45: 92,
    46: 100,
    47: 108,
    48: 117,
    49: 127,
    50: 137,
    51: 148,
    52: 160,
    53: 173,
    54: 188,
    55: 203,
    56: 220,
    57: 238,
    58: 256,
    59: 277,
    60: 300,
  };

  // Get cumulative playtime for the given level
  const cumulativePlaytime = levelingData[level] || 0;

  // Calculate setbacks
  const timeSetBackHours = Math.round(cumulativePlaytime);
  const dollarSetBack = Math.round(cumulativePlaytime * hourlyIncome);
  const goldSetBack = Math.round(dollarSetBack * dollarsToGoldRatio);

  return {
    level,
    timeSetBackHours,
    dollarSetBack,
    goldSetBack,
  };
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
    <div className="min-h-screen flex flex-col bg-gray-900 text-white bg-[url('/wow-background.jpg')] bg-cover bg-center bg-fixed">
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

export default SubmitSuccess;
