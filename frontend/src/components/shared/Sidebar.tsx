/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Menu, Search, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "@/context/authSlice";

export function Sidebar({
  scrollDown,
  pathname,
}: {
  scrollDown: boolean;
  pathname: string;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store: any) => store.auth);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onLogout = () => {
    dispatch(logout() as any);
    dispatch(reset());
    setOpen(false);
    navigate("/auth");
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-4">
        <Link
          to={"/search"}
          aria-label="Search stories"
          className={cn(
            scrollDown
              ? "text-black border-black"
              : `${
                  pathname === "/"
                    ? "text-white border-white"
                    : "text-black border-black"
                }`,
            "min-h-8 min-w-8 rounded-full uppercase justify-center bg-transparent flex items-center border p-2 text-sm",
          )}
        >
          <Search size={14} aria-hidden="true" />
        </Link>
        {user && (
          <Link
            to="/user"
            aria-label="Open your profile"
            className={cn(
              scrollDown || pathname !== "/" ? "border-black" : "border-white",
              "flex size-9 items-center justify-center overflow-hidden rounded-full border",
            )}
          >
            {user.otherData?.avatar ? (
              <img
                src={user.otherData.avatar}
                alt=""
                className="size-full object-cover"
              />
            ) : user.otherData?.name ? (
              <span
                aria-hidden="true"
                className={cn(
                  scrollDown || pathname !== "/" ? "text-black" : "text-white",
                  "text-sm font-semibold",
                )}
              >
                {user.otherData.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <UserRound
                size={17}
                aria-hidden="true"
                className={
                  scrollDown || pathname !== "/" ? "text-black" : "text-white"
                }
              />
            )}
          </Link>
        )}
        <SheetTrigger asChild>
          <button
            type="button"
            className={cn(
              scrollDown
                ? "text-black border-black"
                : `${
                    pathname === "/"
                      ? "text-white border-white"
                      : "text-black border-black"
                  }`,
              "min-h-8 rounded-full uppercase bg-transparent flex items-center border px-3 py-1 text-sm",
            )}
          >
            menu
            <Menu size={14} className="ml-2" aria-hidden="true" />
          </button>
        </SheetTrigger>
      </div>
      <SheetContent
        aria-label="Site navigation"
        className="flex flex-col justify-between items-start bg-neutral-100"
      >
        <div className="grid gap-10 font-semibold pt-24 text-3xl">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          {user && (
            <Link to="/user" onClick={() => setOpen(false)}>
              Profile
            </Link>
          )}
          {!user && (
            <Link to="/auth" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
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
