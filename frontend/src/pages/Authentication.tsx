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
    <div className="flex overflow-hidde w-full  relative h-screen pt-28  ">
      <Login isLogin={login} setIsLogin={setLogin} />
      <Register setLogin={setLogin} isLogin={login} />
      <div
        className={cn(
          login ? "right-0" : "right-1/2",
          "bg-black h-full w-1/2 bg-cover  bg-[url('https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80')]  flex justify-center items-end pb-36 top-0 transition-all duration-700  absolute z-20",
        )}
      >
        <div className="hidden lg:relative lg:block lg:p-12 space-y-6">
          <a className="block text-white" href="#">
            <span className="sr-only">Home</span>

            <Link to={"/"}>
              <h1
                className={
                  "text-[19px] first-letter:text-5xl leading-5 first-letter:-mt-1.5 font-black duration-300   font-jerssy w-40 uppercase  first-letter:float-left text-white "
                }
              >
                News
                <br />
                exus
              </h1>
            </Link>
          </a>

          <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Welcome to News Nexus 🦑
          </h2>

          <p className="mt-4 leading-relaxed text-white/90 max-w-xl">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
            nam dolorum aliquam, quibusdam aperiam voluptatum.
          </p>
          <Button
            onClick={() => setLogin(!login)}
            variant={"outline"}
            className="px-28 text-lg h-12 rounded-xl"
          >
            {login ? "Sign Up" : "Sign In"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
