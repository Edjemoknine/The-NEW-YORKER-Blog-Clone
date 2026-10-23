import jwt from "jsonwebtoken";

export const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, "mySecretKey", {
    expiresIn: "1h",
  });

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, "myRefreshSecretKey", {
    expiresIn: "7d",
  });

export const verifytoken = (req, res, next) => {
  const cookieToken = req.cookies?.accessToken;
  if (!cookieToken) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(cookieToken, "mySecretKey", (error, user) => {
    if (error) {
      return res.status(403).json({ message: "Token is not valid" });
    }
    req.user = user;
    return next();
  });
};
