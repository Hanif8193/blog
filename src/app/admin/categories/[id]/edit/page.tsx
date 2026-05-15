import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { updateCategory } from "@/lib/actions/categories";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  let category;

  try {
    category = await db.query.categories.findFirst({
      where: eq(categories.id, params.id),
    });
  } catch (err) {
    console.error("[admin:edit-category]", err instanceof Error ? err.message : err);
    notFound();
  }

  if (!category) {
    notFound();
  }

  // Bind the updateCategory action with the category ID
  const updateCategoryWithId = updateCategory.bind(null, category.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Edit Category
        </h1>
        <p className="mt-2 text-gray-500">
          Make changes to your category.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <CategoryForm 
          initialData={category} 
          action={updateCategoryWithId} 
        />
      </div>
    </div>
  );
}
