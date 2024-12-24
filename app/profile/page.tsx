import ProfileForm from "@/components/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-center text-yellow-400 mb-8 font-wow">
            Your Profile
          </h1>
          <ProfileForm />
        </div>
      </main>
    </div>
  );
}
