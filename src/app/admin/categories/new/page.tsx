import { CategoryForm } from "@/components/admin/CategoryForm";
import { createCategory } from "@/lib/actions/categories";

export default async function NewCategoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Create New Category
        </h1>
        <p className="mt-2 text-gray-500">
          Add a new category to organize your blog posts.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <CategoryForm action={createCategory} />
      </div>
    </div>
  );
}
