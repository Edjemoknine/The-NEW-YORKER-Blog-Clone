import { Router, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, or } from "drizzle-orm";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { publicUser } from "../db/serialize.ts";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/verify.ts";

const authRoute = Router();

const getAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite: "none" | "lax" = isProduction ? "none" : "lax";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite,
  };
};

const clearAuthCookies = (res: Response) => {
  const options = getAuthCookieOptions();
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
};

authRoute.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(or(eq(users.name, name), eq(users.email, email)))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning();

    return res.status(201).json({ message: "success", user: publicUser(user) });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return res.status(409).json({ message: "User already exists" });
    }
    console.error("User registration failed:", error);
    return res.status(500).json({ message: "Unable to register user" });
  }
});

authRoute.post("/login", async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const cookieOptions = getAuthCookieOptions();

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      otherData: publicUser(user),
      accessToken,
    });
  } catch (error) {
    console.error("User login failed:", error);
    return res.status(500).json({ message: "Unable to log in" });
  }
});

authRoute.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Authentication required" });
  }

  let tokenUserId: string;
  try {
    const verifiedToken = jwt.verify(refreshToken, "myRefreshSecretKey");
    if (
      typeof verifiedToken === "string" ||
      typeof verifiedToken.id !== "string"
    ) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "Authentication required" });
    }
    tokenUserId = verifiedToken.id;
  } catch {
    clearAuthCookies(res);
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, tokenUserId))
      .limit(1);

    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "Authentication required" });
    }

    const cookieOptions = getAuthCookieOptions();
    res.cookie("accessToken", generateAccessToken(user), {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", generateRefreshToken(user), {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      otherData: publicUser(user),
    });
  } catch (error) {
    console.error("Session refresh failed:", error);
    return res.status(500).json({ message: "Unable to refresh session" });
  }
});

authRoute.post("/logout", (_req, res) => {
  clearAuthCookies(res);
  return res.sendStatus(204);
});

export default authRoute;
