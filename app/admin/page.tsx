import UnapprovedBotKills from "@/components/UnapprovedBotKills";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <UnapprovedBotKills />
        </div>
      </main>
    </div>
  );
}
