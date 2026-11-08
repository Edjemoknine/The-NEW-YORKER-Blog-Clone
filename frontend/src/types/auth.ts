import type { Dispatch, SetStateAction } from "react";

export type SessionStatus =
  | "unknown"
  | "checking"
  | "authenticated"
  | "unauthenticated"
  | "error";

export interface LoginPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
}

export type AuthFormProps = {
  isLogin: boolean;
  setLogin: (value: boolean) => void;
};

export type AuthPanelProps = {
  isLogin: boolean;
  setLogin: (isLogin: boolean) => void;
};

export type LoginPanelProps = {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
};
