import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";
import { Edit } from "lucide-react";
import { safeQuery } from "@/lib/safe-query";

export default async function AdminCategoriesPage() {
  const allCategories = await safeQuery(
    "admin:categories",
    () => db.query.categories.findMany({ orderBy: [asc(categories.name)] }),
    []
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Manage Categories
          </h1>
          <p className="mt-2 text-gray-500">
            Organize your blogs with categories.
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button variant="primary" size="md">
            Create New Category
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allCategories.length > 0 ? (
              allCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      <Button variant="secondary" size="sm" className="p-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteCategoryButton id={category.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  No categories found. Start by creating your first category!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
