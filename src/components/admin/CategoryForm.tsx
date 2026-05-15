"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
  };
  action: (formData: FormData) => Promise<{ error?: any } | void>;
}

export function CategoryForm({ initialData, action }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await action(formData);

    if (result && result.error) {
      setError(typeof result.error === "string" ? result.error : "Validation failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-gray-700">
            Category Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={initialData?.name}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="e.g. Technology"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-semibold text-gray-700">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={initialData?.slug}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="e.g. technology"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
        >
          {loading ? "Saving..." : initialData ? "Update Category" : "Create Category"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
