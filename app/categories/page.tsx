import { createPublicClient } from "@/lib/supabase/client";
import CategoryForm from "./CategoriesForm";
import CategoryList from "./CategoriesList";

type Category = {
  id: number;
  name: string;
};

async function addCategory(name: string) {
  "use server";
  const supabase = createPublicClient();
  await supabase.from("categories").insert({ name });
}

async function updateCategory(id: number, name: string) {
  "use server";
  const supabase = createPublicClient();
  await supabase.from("categories").update({ name }).eq("id", id);
}

async function deleteCategory(id: number) {
  "use server";
  const supabase = createPublicClient();
  await supabase.from("categories").delete().eq("id", id);
}

export default async function CategoriesPage() {
  const supabase = createPublicClient();
  const { data: categories, error } = await supabase
    .from<"categories", Category>("categories")
    .select("*")
    .order("id", { ascending: true });

  if (error) console.error(error);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <CategoryForm addCategory={addCategory} />
      <CategoryList
        categories={categories ?? []}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
      />
    </div>
  );
}
