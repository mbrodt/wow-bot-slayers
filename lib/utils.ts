import { BotKill } from "@/components/BotKillGrid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BotSetbackResult {
  level?: number;
  timeSetBackHours: number;
  dollarSetBack: number;
  goldSetBack: number;
}

export function calculateBotSetback(
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

export function calculateTotalBotSetback(botKills: BotKill[]) {
  return botKills.reduce(
    (acc, kill) => {
      const result = calculateBotSetback(kill.bot_level);
      acc.timeSetBackHours += result.timeSetBackHours;
      acc.dollarSetBack += result.dollarSetBack;
      acc.goldSetBack += result.goldSetBack;
      return acc;
    },
    { timeSetBackHours: 0, dollarSetBack: 0, goldSetBack: 0 }
  );
}
