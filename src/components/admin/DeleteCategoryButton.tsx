"use client";

import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/lib/actions/categories";
import { Trash2 } from "lucide-react";

export function DeleteCategoryButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const result = await deleteCategory(id);
      if (result && (result as any).error) {
        alert((result as any).error);
      }
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
