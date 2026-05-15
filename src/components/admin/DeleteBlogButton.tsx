"use client";

import { Button } from "@/components/ui/button";
import { deleteBlog } from "@/lib/actions/blogs";
import { Trash2 } from "lucide-react";

export function DeleteBlogButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      await deleteBlog(id);
    }
  };

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleDelete}
      className="p-2"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
