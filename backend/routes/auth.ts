import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { publicUser } from "../db/serialize.ts";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/verify.ts";

const authRoute = Router();

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
    if (error.code === "23505") {
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
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

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

export default authRoute;
