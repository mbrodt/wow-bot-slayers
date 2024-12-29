import SubmitForm from "@/components/SubmitForm";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Submit kill",
};

export default async function SubmitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-yellow-400 mb-8 font-wow">
            Submit Your Bot Kills
          </h1>
          <div className="grid grid-cols-1 mx-auto max-w-2xl gap-8 mb-12">
            <div>
              <SubmitForm user={user} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
