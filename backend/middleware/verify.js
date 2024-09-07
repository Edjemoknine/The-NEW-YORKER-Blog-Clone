const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(cookieParser());

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, "mySecretKey", {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, "myRefreshSecretKey", {
    expiresIn: "7d",
  });
};

const verifytoken = (req, res, next) => {
  const cookieToken = req.cookies.accessToken;
  console.log({ cookieToken });

  if (!cookieToken) {
    if (renewToken(req, res)) {
      next();
    }
  } else {
    jwt.verify(cookieToken, "mySecretKey", (err, user) => {
      if (err) return res.status(403).json(err, "Token is not valid!");
      req.user = user;
      next();
    });
  }
};

function renewToken(req, res) {
  const refreshtoken = req.cookies.refreshToken;

  let newAccessToken;

  if (!refreshtoken) {
    return res.status(403).json("Token is not valid!, No refresh token");
  } else {
    jwt.verify(refreshtoken, "myRefreshSecretKey", (err, user) => {
      err &&
        console.log(err, "refresh token is not valid to genarate new token");

      newAccessToken = generateAccessToken(user);
      res.cookie("accessToken", newAccessToken, { maxAge: 60000 });
    });
  }
  return res.status(200).json({ newAccessToken });
}

module.exports = {
  verifytoken,
  renewToken,
  generateAccessToken,
  generateRefreshToken,
};
