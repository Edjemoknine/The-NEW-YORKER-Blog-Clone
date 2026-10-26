import { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";

import api from "@/api/client";
import { CatDialog } from "./CategoryModel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Category = {
  name: string;
};

type SelectCategoryProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function SelectCategory({ onChange, value }: SelectCategoryProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchCategories() {
      try {
        const res = await api.get("/api/categories");

        if (active) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  const toggleCategory = (name: string, checked: boolean) => {
    if (checked) {
      if (!value.includes(name)) {
        onChange([...value, name]);
      }
    } else {
      onChange(value.filter((category) => category !== name));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {value.length > 0 ? value.join(", ") : "Select categories"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">Categories</p>
          <span className="text-xs text-muted-foreground">
            {value.length} selected
          </span>
        </div>

        <div className="max-h-60 space-y-3 overflow-y-auto">
          {categories.map((category) => (
            <label
              key={category.name}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Checkbox
                checked={value.includes(category.name)}
                onCheckedChange={(checked) =>
                  toggleCategory(category.name, checked === true)
                }
              />
              {category.name}
            </label>
          ))}

          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No categories available.
            </p>
          )}
        </div>

        <div className="mt-3 border-t pt-3">
          <CatDialog />
        </div>

        <Button
          type="button"
          className="mt-2 w-full"
          size="sm"
          onClick={() => setOpen(false)}
        >
          Done
        </Button>
      </PopoverContent>
    </Popover>
  );
}
