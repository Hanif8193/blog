"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SettingsFormProps {
  currentEmail: string;
}

type Status = {
  type: "success" | "error";
  message: string;
  requiresRelogin?: boolean;
};

export function SettingsForm({ currentEmail }: SettingsFormProps) {
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const res = await fetch("/api/admin/update-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setStatus({ type: "error", message: data.error ?? "Update failed" });
      return;
    }

    setStatus({
      type: "success",
      message: data.message,
      requiresRelogin: data.requiresRelogin,
    });
    setPassword("");

    if (data.requiresRelogin) {
      setTimeout(() => signOut({ callbackUrl: "/login" }), 2000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status && (
        <div
          className={`rounded-md px-4 py-3 text-sm border ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {status.message}
          {status.requiresRelogin && (
            <span className="mt-1 block text-xs">
              Signing you out in 2 seconds to apply changes...
            </span>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          New Password
          <span className="ml-1 text-xs text-gray-400">
            (leave blank to keep current)
          </span>
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
