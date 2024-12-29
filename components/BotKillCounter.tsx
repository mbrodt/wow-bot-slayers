"use client";

import { useState, useEffect } from "react";
import { Shield, Clock, DollarSign, Coins } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { BotSetbackResult, calculateTotalBotSetback } from "@/lib/utils";
import { BotKill } from "./BotKillGrid";
import Image from "next/image";
async function fetchTotalBotKills() {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("bot_kills")
    .select("*")
    .eq("is_approved", true);

  const count = data?.length || 0;
  const totalBotSetback = calculateTotalBotSetback(data as BotKill[]);
  console.log("totalBotSetback:", totalBotSetback);

  if (error) {
    console.error("Error fetching bot kills:", error);
    return {
      count: 0,
      totalBotSetback: {
        timeSetBackHours: 0,
        dollarSetBack: 0,
        goldSetBack: 0,
      },
    };
  }
  return { count, totalBotSetback };
}

export default function BotKillCounter({ initialValue = 0 }) {
  const [count, setCount] = useState(initialValue);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [totalBotSetback, setTotalBotSetback] = useState<BotSetbackResult>({
    timeSetBackHours: 0,
    dollarSetBack: 0,
    goldSetBack: 0,
  });

  useEffect(() => {
    fetchTotalBotKills().then(({ count, totalBotSetback }) => {
      setCount(count);
      setTotalBotSetback(totalBotSetback);
    });

    const timer = setInterval(() => {
      fetchTotalBotKills().then(({ count, totalBotSetback }) => {
        setCount(count);
        setTotalBotSetback(totalBotSetback);
        setIsIncrementing(true);
        setTimeout(() => setIsIncrementing(false), 500);
      });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center mb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-purple-500/20 blur-xl"></div>
      <div className="relative bg-gray-900/80 border-2 border-yellow-500 rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-blue-400 mb-4 font-wow">
          Bots Vanquished
        </h2>
        <div className="flex items-center justify-center space-x-4">
          <Shield className="w-12 h-12 text-yellow-500 animate-pulse" />
          <div
            className={`text-6xl md:text-8xl font-extrabold text-green-400 font-wow transition-all duration-300 ease-in-out ${
              isIncrementing ? "scale-110 text-yellow-400" : ""
            }`}
          >
            {count.toLocaleString()}
          </div>
          <Shield className="w-12 h-12 text-yellow-500 animate-pulse" />
        </div>
        <p className="mt-4 text-xl text-blue-300 font-wow">
          Azeroth grows safer by the minute!
        </p>
        <div className="mt-4 h-5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${Math.min((count / 2000) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-blue-300 font-wow">
          Progress: {count}/2000 (One full server of bots)
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="relative aspect-video mb-4 max-w-[10rem] md:max-w-[16rem] mx-auto">
              <Image src="/clock.png" alt="Hours setback" fill />
            </div>

            <p className="text-2xl font-bold text-yellow-400 font-wow">
              {totalBotSetback.timeSetBackHours.toLocaleString()}
            </p>
            <p className="text-sm text-blue-300">Hours Set Back</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="relative aspect-video mb-4 max-w-[10rem] md:max-w-[16rem] mx-auto">
              <Image src="/dollars.png" alt="Dollar setback" fill />
            </div>

            <p className="text-2xl font-bold text-yellow-400 font-wow">
              ${totalBotSetback.dollarSetBack.toLocaleString()}
            </p>
            <p className="text-sm text-blue-300">Dollars Set Back</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="relative aspect-video mb-4 max-w-[10rem] md:max-w-[16rem] mx-auto">
              <Image src="/gold.png" alt="Gold setback" fill />
            </div>

            <p className="text-2xl font-bold text-yellow-400 font-wow">
              {totalBotSetback.goldSetBack.toLocaleString()}
            </p>
            <p className="text-sm text-blue-300">Gold Set Back</p>
          </div>
        </div>
      </div>
    </div>
  );
}
