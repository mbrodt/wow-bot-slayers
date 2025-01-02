import Leaderboard from "@/components/Leaderboard";

export const metadata = {
  title: "Leaderboard",
};

export const dynamic = "force-static";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-yellow-400 mb-8 font-wow">
            Leaderboard
          </h1>
          <Leaderboard />
        </div>
      </main>
    </div>
  );
}
