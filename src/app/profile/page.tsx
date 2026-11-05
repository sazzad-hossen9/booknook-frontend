import { PrivateRoute } from "@/components/PrivateRoute";
import { ProfileClient } from "./_components/ProfileClient";

export const metadata = {
  title: "My Profile",
  description: "View and manage your BookNook member profile.",
};

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12">
        <ProfileClient />
      </div>
    </PrivateRoute>
  );
}

