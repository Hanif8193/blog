"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  blogId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({ blogId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    const wasLiked = liked;

    // Optimistic update
    setLiked(!wasLiked);
    setCount((n) => (wasLiked ? n - 1 : n + 1));
    setPending(true);

    try {
      const res = await fetch(`/api/blogs/${blogId}/like`, { method: "POST" });
      const data: { liked: boolean; count: number } = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    } catch {
      // Revert on network error
      setLiked(wasLiked);
      setCount((n) => (wasLiked ? n + 1 : n - 1));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-label={liked ? "Unlike this post" : "Like this post"}
      className={[
        "group flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200",
        liked
          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
      ].join(" ")}
    >
      <Heart
        className={[
          "h-4 w-4 transition-all duration-200",
          liked
            ? "fill-red-500 text-red-500 scale-110"
            : "group-hover:scale-110",
        ].join(" ")}
      />
      <span>{count}</span>
    </button>
  );
}
