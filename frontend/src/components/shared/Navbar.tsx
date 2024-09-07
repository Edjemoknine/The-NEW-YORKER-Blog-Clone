import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [scrollDown, setscrollDown] = useState(false);
  const [hideScroll, setHideScroll] = useState(false);
  const { pathname } = useLocation();

  const [prevScroll, setPrevScroll] = useState(0);

  const scrolling = () => {
    if (window.scrollY > window.innerHeight) {
      setscrollDown(true);
    } else {
      setscrollDown(false);
    }
  };

  const hideNavbar = () => {
    if (window.scrollY > prevScroll) {
      setHideScroll(true);
    } else {
      setHideScroll(false);
    }
    setPrevScroll(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", scrolling);
    window.addEventListener("scroll", hideNavbar);
    return () => {
      window.removeEventListener("scroll", hideNavbar);
      window.removeEventListener("scroll", scrolling);
    };
  });

  return (
    <nav>
      <div
        className={cn(
          "flex items-center justify-between transition-all   duration-500 fixed z-50  left-0 w-full  p-4 sm:p-6 xl:p-8",
          scrollDown
            ? ` bg-white shadow-md`
            : ` ${pathname === "/" ? "bg-transparent" : "bg-white"}`,
          hideScroll ? "-top-full" : "top-0 "
        )}
      >
        <Link to={"/"}>
          {" "}
          <h1
            className={cn(
              scrollDown
                ? "text-[19px] first-letter:text-5xl leading-5 first-letter:-mt-1.5 text-black"
                : `first-letter:text-6xl text-2xl leading-6 first-letter:-mt-2 ${
                    pathname === "/" ? "text-white" : "text-black"
                  } `,
              "font-black duration-300   font-jerssy w-40 uppercase  first-letter:float-left  "
            )}
          >
            News
            <br />
            exus
          </h1>
        </Link>
        <Sidebar scrollDown={scrollDown} pathname={pathname} />
      </div>
    </nav>
  );
};

export default Navbar;
