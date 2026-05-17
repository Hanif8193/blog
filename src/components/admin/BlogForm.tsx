"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/shared/image-upload";
import { slugify } from "@/lib/slugify";

interface BlogFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    image: string | null;
    categoryId: string;
    published: boolean;
  };
  categories: { id: string; name: string }[];
  action: (formData: FormData) => Promise<{ error?: any } | void>;
}

export function BlogForm({ initialData, categories, action }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.image || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  // Auto-generate slug from title if not manually edited
  useEffect(() => {
    if (!isSlugEdited && !initialData) {
      setSlug(slugify(title));
    }
  }, [title, isSlugEdited, initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("image", imageUrl);
    formData.set("title", title);
    formData.set("slug", slug);

    const result = await action(formData);

    if (result && result.error) {
      console.error("Form submission error:", result.error);
      setError(typeof result.error === "string" ? result.error : "Validation failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Featured Image
        </label>
        <ImageUpload
          value={imageUrl}
          onChange={(url) => setImageUrl(url || "")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-semibold text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Blog Title"
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
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setIsSlugEdited(true);
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="my-blog-post"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="categoryId" className="text-sm font-semibold text-gray-700">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={initialData?.categoryId}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="excerpt" className="text-sm font-semibold text-gray-700">
            Excerpt (Optional)
          </label>
          <input
            id="excerpt"
            name="excerpt"
            type="text"
            defaultValue={initialData?.excerpt || ""}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Brief summary..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-semibold text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={12}
          defaultValue={initialData?.content}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none resize-none"
          placeholder="Write your blog content here..."
        />
      </div>

      <div className="flex items-center space-x-3">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={initialData?.published}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Publish this post immediately
        </label>
      </div>

      <div className="flex items-center space-x-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
        >
          {loading ? "Saving..." : initialData ? "Update Blog" : "Create Blog"}
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
