/* eslint-disable @typescript-eslint/no-explicit-any */
import Login from "@/components/shared/Login";
import Register from "@/components/shared/Register";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
const Authentication = () => {
  const [login, setLogin] = useState(false);
  const { user } = useSelector((store: any) => store.auth);
  if (user) return <Navigate to={"/"} />;
  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background pt-28">
      <Login isLogin={login} setIsLogin={setLogin} />
      <Register setLogin={setLogin} isLogin={login} />
      <div
        className={cn(
          login ? "right-0" : "right-1/2",
          "absolute top-0 z-20 flex h-full w-1/2 items-end justify-center bg-foreground bg-cover pb-36 transition-all duration-700 bg-[url('https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80')]",
        )}
      >
        <div className="hidden lg:relative lg:block lg:p-12 space-y-6">
          <a className="block text-white" href="#">
            <span className="sr-only">Home</span>

            <Link to={"/"}>
              <h1
                className={
                  "w-40 font-editorial text-xl font-bold uppercase leading-5 tracking-tight text-white first-letter:float-left first-letter:-mt-1.5 first-letter:text-5xl"
                }
              >
                News
                <br />
                exus
              </h1>
            </Link>
          </a>

          <h2 className="mt-6 font-editorial text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
            Welcome to News Nexus 🦑
          </h2>

          <p className="mt-4 max-w-xl leading-relaxed text-white/90">
            Read original reporting, criticism, fiction, and ideas from across
            the world.
          </p>
          <Button
            onClick={() => setLogin(!login)}
            variant={"outline"}
            className="h-12 rounded-sm px-28 text-lg"
          >
            {login ? "Sign Up" : "Sign In"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
