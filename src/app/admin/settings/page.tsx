import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your login email or password. You will be signed out to apply
          any credential changes.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <SettingsForm currentEmail={session.user.email} />
      </div>
    </div>
  );
}
