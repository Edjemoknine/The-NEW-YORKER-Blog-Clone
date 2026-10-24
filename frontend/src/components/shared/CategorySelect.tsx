import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { CatDialog } from "./CategoryModel";
import api from "@/api/client";

export function SelectCategory({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  const [categories, setCategories] = useState<Array<{ name: string }>>([]);

  const fetchCategories = async () => {
    api.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          {categories.map((category) => (
            <SelectItem key={category.name} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>

        <CatDialog />
      </SelectContent>
    </Select>
  );
}
