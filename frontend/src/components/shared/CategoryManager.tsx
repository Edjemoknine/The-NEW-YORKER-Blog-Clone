import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, FolderOpen, Plus, Tags, Trash2 } from "lucide-react";
import {
  useAddCategory,
  useCategoriesList,
  useCategoryPosts,
  useDeleteCategory,
} from "@/api/hooks/useCategories";
import type { Category, CategoryPost } from "@/types/categories";
import { NewsCard } from "@/components/utils/NewsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteCategoryModel from "@/components/shared/DeleteCategoryModel";

const CategoryManager = () => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: hasCategoryError,
    error: categoryError,
    refetch: refetchCategories,
  } = useCategoriesList();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();

  useEffect(() => {
    if (
      selectedCategory &&
      !categories.some((category: Category) => category.name === selectedCategory)
    ) {
      setSelectedCategory(categories[0]?.name ?? "");
    } else if (!selectedCategory && categories.length) {
      setSelectedCategory(categories[0].name);
    }
  }, [categories, selectedCategory]);

  const {
    data: postData,
    isLoading: isLoadingPosts,
    isError: hasPostError,
    error: postError,
    refetch: refetchPosts,
  } = useCategoryPosts(selectedCategory, 4, Boolean(selectedCategory));

  const handleCreateCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name || addCategory.isPending) return;

    addCategory.mutate(name, {
      onSuccess: (createdCategory) => {
        setCategoryName("");
        setSelectedCategory(createdCategory.name);
      },
    });
  };

  const handleDeleteCategory = () => {
    if (!categoryToDelete || deleteCategory.isPending) return;
    deleteCategory.mutate(categoryToDelete.id, {
      onSuccess: () => setCategoryToDelete(null),
    });
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleCreateCategory}
        className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="new-category"
            className="mb-2 block text-sm font-semibold text-neutral-700"
          >
            New category
          </label>
          <Input
            id="new-category"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            maxLength={255}
            placeholder="e.g. Science & Technology"
            disabled={addCategory.isPending}
            className="rounded-xl"
          />
        </div>
        <Button
          type="submit"
          disabled={!categoryName.trim() || addCategory.isPending}
          className="gap-2 rounded-xl bg-[#202b42] hover:bg-[#303d58]"
        >
          <Plus className="size-4" />
          {addCategory.isPending ? "Adding..." : "Add category"}
        </Button>
      </form>

      {isLoadingCategories ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-sm text-neutral-500">
          Loading categories...
        </div>
      ) : hasCategoryError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700"
        >
          <p>
            {categoryError instanceof Error
              ? categoryError.message
              : "Could not load categories."}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => refetchCategories()}
          >
            Try again
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
          <Tags className="mx-auto size-8 text-neutral-400" />
          <h3 className="mt-3 font-semibold">No categories yet</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Add a category to organize and browse related posts.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 px-2 text-sm font-bold text-neutral-700">
              Categories <span className="text-neutral-400">({categories.length})</span>
            </h3>
            <ul className="space-y-1">
              {categories.map((category: Category) => {
                const isSelected = category.name === selectedCategory;
                return (
                  <li key={category.id} className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(category.name)}
                      aria-pressed={isSelected}
                      className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                        isSelected
                          ? "bg-[#202b42] text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <FolderOpen className="size-4 shrink-0" />
                      <span className="truncate">{category.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(category)}
                      disabled={deleteCategory.isPending}
                      aria-label={`Delete ${category.name} category`}
                      title="Delete category"
                      className="grid size-9 shrink-0 place-items-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section aria-label={`${selectedCategory} posts`} className="min-w-0">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#b3262d]">
                  Category posts
                </p>
                <h3 className="text-2xl font-bold text-[#172033]">
                  {selectedCategory}
                </h3>
              </div>
              <Link
                to={`/category/${encodeURIComponent(selectedCategory)}`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#202b42] hover:underline"
              >
                View all posts <ArrowUpRight className="size-4" />
              </Link>
            </div>

            {isLoadingPosts ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-sm text-neutral-500">
                Loading posts...
              </div>
            ) : hasPostError ? (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700"
              >
                <p>
                  {postError instanceof Error
                    ? postError.message
                    : "Could not load posts for this category."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 rounded-xl"
                  onClick={() => refetchPosts()}
                >
                  Try again
                </Button>
              </div>
            ) : postData?.posts?.length ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {(postData.posts as CategoryPost[]).map((post) => (
                  <NewsCard key={post.id ?? post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
                <p className="font-semibold">No posts in this category yet</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Posts tagged with this category will appear here.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
      <DeleteCategoryModel
        category={categoryToDelete}
        isDeleting={deleteCategory.isPending}
        onOpenChange={(open) => {
          if (!open) setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
};

export default CategoryManager;
