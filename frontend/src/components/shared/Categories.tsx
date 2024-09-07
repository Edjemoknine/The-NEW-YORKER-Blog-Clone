import { cn } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// const CATEGORIES = [
//   "The Latest",
//   "News",
//   "Books & Culture",
//   "Fiction & Poetry",
//   "Humor & Cartoons",
//   "Magazine",
//   "Puzzles & Games",
//   "Goings On",
//   "Shope",
// ];
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
  const [Categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", hideNavbar);
    return () => {
      window.removeEventListener("scroll", hideNavbar);
    };
  });
  type Props = {
    name: string;
    id: number;
  };

  return (
    <div
      className={cn(
        "items-center bg-white font-grotesk border-t duration-500 transition-all gap-4 text-sm leading-3 z-50 py-6 pt-6 border-b border-neutral-300 sticky  left-0 w-full justify-center flex-wrap text-center md:flex hidden",
        hideScroll ? "-top-full" : "top-24"
      )}
    >
      {Categories.map((item: Props) => (
        <Link
          to={`/category/${item.name}`}
          key={item.name}
          className="hover:border-b-2 border-b-2 hover:border-neutral-700 border-transparent "
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Categories;
