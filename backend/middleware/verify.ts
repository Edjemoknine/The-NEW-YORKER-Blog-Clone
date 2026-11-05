import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

type TokenUser = { id: string; email: string };
type AuthenticatedRequest = Request & { user?: jwt.JwtPayload };

export const generateAccessToken = (user: TokenUser) =>
  jwt.sign({ id: user.id, email: user.email }, "mySecretKey", {
    expiresIn: "1h",
  });

export const generateRefreshToken = (user: TokenUser) =>
  jwt.sign({ id: user.id, email: user.email }, "myRefreshSecretKey", {
    expiresIn: "7d",
  });

export const getUserIdFromToken = (token: string | undefined) => {
  if (!token) return null;

  try {
    const user = jwt.verify(token, "mySecretKey");
    return typeof user === "object" &&
      user !== null &&
      typeof user.id === "string"
      ? user.id
      : null;
  } catch {
    return null;
  }
};

export const verifytoken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const cookieToken = req.cookies?.accessToken;
  if (!cookieToken) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const user = jwt.verify(cookieToken, "mySecretKey");
    if (typeof user === "string") {
      return res.status(401).json({ message: "Authentication required" });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Authentication required" });
  }
};
