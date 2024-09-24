import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";

import { CatDialog } from "./CategoryModel";

export function SelectCategory({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  const [categories, setCategories] = useState<Array<{ name: string }>>([]);
  const [category, setCategory] = useState<string>("");

  const fetchCategories = async () => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    try {
      await axios.post("/api/categories", { category });
    } catch (error) {
      console.log(error);
    }
  };

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

        <CatDialog
          addCategory={addCategory}
          category={category}
          setCategory={setCategory}
        />
      </SelectContent>
    </Select>
  );
}
