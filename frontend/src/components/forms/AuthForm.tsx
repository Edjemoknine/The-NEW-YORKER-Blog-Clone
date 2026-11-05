/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, register, reset } from "../../context/authSlice";

import { Label } from "../shared/LabelUi";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

import { AppDispatch } from "@/context/store";
import { Input } from "../shared/InputUi";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function SignupForm({
  isLogin,
  setLogin,
}: {
  isLogin: boolean;
  setLogin: (value: boolean) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isError, isSuccess, message } = useSelector(
    (store: any) => store.auth,
  );
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    if (isSuccess || user) {
      navigate("/user");
    }
    dispatch(reset());
  }, [user, isError, message, dispatch, navigate, isSuccess]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !data.password || (isLogin && !data.email)) return;

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await dispatch(login(data));
      } else {
        const result = await dispatch(register(data));
        if (register.fulfilled.match(result)) {
          setLogin(true);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        {isLogin ? "Sign In" : "Sign Up "}
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        {isLogin ? "Welcome again to News Nexus" : "Welcome to News Nexus"}
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                placeholder="Tyler"
                type="text"
                name="name"
                onChange={handleChange}
                value={data.name}
              />
            </LabelInputContainer>
          </div>
        )}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            placeholder="projectmayhem@fc.com"
            onChange={handleChange}
            value={data.email}
            type="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <div className="relative z-10 isolate">
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              value={data.password}
              className="pr-12"
            />
            <button
              type="button"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-controls="password"
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 pointer-events-auto text-neutral-500 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </LabelInputContainer>

        <button
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {isSubmitting && (
            <Loader2 className="mr-2 inline animate-spin" size={16} aria-hidden="true" />
          )}
          {isSubmitting
            ? isLogin
              ? "Signing in..."
              : "Creating account..."
            : isLogin
              ? "Sign In →"
              : "Sign Up →"}
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
