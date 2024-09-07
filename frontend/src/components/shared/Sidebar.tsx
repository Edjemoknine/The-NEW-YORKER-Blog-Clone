import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";

import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "@/context/authSlice";

export function Sidebar({ scrollDown, pathname }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/auth");
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center gap-4">
          <Link
            to={"/search"}
            className={cn(
              scrollDown
                ? "text-black border-black"
                : `${
                    pathname === "/"
                      ? "text-white border-white"
                      : "text-black border-black"
                  }`,
              "rounded-full uppercase justify-center  bg-transparent flex items-center border p-2 text-sm   "
            )}
          >
            <Search size={14} />
          </Link>
          <button
            className={cn(
              scrollDown
                ? "text-black border-black"
                : `${
                    pathname === "/"
                      ? "text-white border-white"
                      : "text-black border-black"
                  }`,
              "rounded-full uppercase bg-transparent flex items-center border px-3 py-1 text-sm   "
            )}
          >
            menu
            <Menu size={14} className="ml-2" />
          </button>
        </div>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between items-start  bg-neutral-100">
        <div className="grid gap-10 font-semibold pt-24 text-3xl">
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About</Link>
          {user && <Link to="/user">Profile</Link>}
          {!user && <Link to="/auth">Login</Link>}
        </div>
        <SheetFooter>
          {user && (
            <Button
              onClick={onLogout}
              className="px-24 py-6 rounded-full mb-20"
            >
              Logout
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
