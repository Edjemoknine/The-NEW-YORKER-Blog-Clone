import { useAddCategory } from "@/api/hooks/useCategories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function CatDialog() {
  const [category, setCategory] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false); // 1. Add open state

  const { mutate, isPending } = useAddCategory();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) return;

    mutate(category, {
      onSuccess: () => {
        setCategory("");
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size={"sm"}>
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category related to that post.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={category}
              className="col-span-3"
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category name..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isPending} type="button" onClick={handleFormSubmit}>
            {isPending ? `Loading...` : `Add`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
