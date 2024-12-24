import BotKillCounter from "@/components/BotKillCounter";
import BotKillGrid from "@/components/BotKillGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-yellow-400 mb-8 font-wow">
            Join the Bot-Slaying Movement
          </h1>
          <BotKillCounter />
          <BotKillGrid showVoting />
        </div>
      </main>
      <Footer />
    </div>
  );
}
