"use client";

import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

async function fetchTotalBotKills() {
  const { count, error } = await supabase
    .from("bot_kills")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching bot kills:", error);
    return 0;
  }
  return count || 0;
}

export default function BotKillCounter({ initialValue = 0 }) {
  const [count, setCount] = useState(initialValue);
  const [isIncrementing, setIsIncrementing] = useState(false);

  useEffect(() => {
    fetchTotalBotKills().then(setCount);

    const timer = setInterval(() => {
      fetchTotalBotKills().then((total) => {
        setCount(total);
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
        <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${Math.min((count / 500) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-blue-300 font-wow">
          Progress: {count}/500 (Stretch Goal)
        </p>
      </div>
    </div>
  );
}
