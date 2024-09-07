const express = require("express");
const User = require("../models/User");
const authRoute = express.Router();
const bcrypt = require("bcrypt");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/verify");

authRoute.post("/register", async (req, res) => {
  const data = req.body;

  const user = await User.findOne({ name: data.name });
  if (user) return res.status(409).json({ message: "User already exists" });
  const hashedPassword = await bcrypt.hash(data.password, 10);
  try {
    const newUser = new User({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(201).json({ message: "success", user });
  } catch (error) {
    console.log(error);
  }
});

// ----------------- Login -------------------------
authRoute.post("/login", async (req, res) => {
  console.log(req.body);
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) res.status(404).json({ message: "User not found" });

    const { ...otherData } = user._doc;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, { maxAge: 6000 });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 3000000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ otherData, accessToken });
  } catch (error) {
    console.log(error);
  }
});

module.exports = authRoute;
