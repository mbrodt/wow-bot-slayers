import ProfileForm from "@/components/ProfileForm";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await supabase
    .from("profiles")
    .select()
    .eq("id", user?.id)
    .single();
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto ">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-yellow-400 mb-8 font-wow">
            Your Profile
          </h1>
          <p className="mt-4 text-lg md:text-xl text-blue-300 font-wow text-center mb-4">
            This will be used to identify you on the Leaderboard
          </p>
          <ProfileForm
            initialCharacterName={profile.data.character_name}
            user={user}
          />
        </div>
      </main>
    </div>
  );
}
