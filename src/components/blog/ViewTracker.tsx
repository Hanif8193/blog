"use client";

import { useEffect } from "react";

export function ViewTracker({ blogId }: { blogId: string }) {
  useEffect(() => {
    fetch(`/api/blogs/${blogId}/view`, { method: "POST" }).catch(() => {});
  }, [blogId]);

  return null;
}
