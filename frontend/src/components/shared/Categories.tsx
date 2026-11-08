import { useCategories } from "@/api/hooks/useCategories";
import { cn } from "@/lib/utils";
import { Category } from "@/types/categories";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Categories = () => {
  const [hideScroll, setHideScroll] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);

  const hideNavbar = () => {
    if (window.scrollY > prevScroll) {
      setHideScroll(true);
    } else {
      setHideScroll(false);
    }
    setPrevScroll(window.scrollY);
  };
  const { data: categories } = useCategories();
  useEffect(() => {
    window.addEventListener("scroll", hideNavbar);
    return () => {
      window.removeEventListener("scroll", hideNavbar);
    };
  });
  return (
    <div
      className={cn(
        "sticky left-0 z-50 hidden w-full flex-wrap items-center justify-center gap-5 border-y border-border bg-background/95 py-5 pt-5 text-center text-xs font-semibold uppercase tracking-[0.12em] backdrop-blur transition-all duration-500 md:flex",
        hideScroll ? "-top-full" : "top-24",
      )}
    >
      {categories?.map((item: Category) => (
        <Link
          to={`/category/${item.name}`}
          key={item.name}
          className="border-b-2 border-transparent py-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Categories;
