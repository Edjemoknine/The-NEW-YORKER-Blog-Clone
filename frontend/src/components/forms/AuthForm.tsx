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
    <div className="editorial-surface mx-auto w-full max-w-md p-4 shadow-sm md:p-8">
      <h2 className="font-editorial text-2xl font-semibold text-foreground">
        {isLogin ? "Sign In" : "Sign Up "}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
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
              className="pointer-events-auto absolute right-3 top-1/2 z-20 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
          className="relative block h-10 w-full rounded-sm bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
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
        </button>

        <div className="my-8 h-px w-full bg-border" />
      </form>
    </div>
  );
}

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
