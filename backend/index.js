const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dostenv = require("dotenv");
const mongoose = require("mongoose");

app.use(express.json());
app.use(
  cors({
      origin: ['https://the-new-yorker-blog-frontend.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
);

app.use(cookieParser());
dostenv.config();

const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const catRoute = require("./routes/category.js");
const postRoute = require("./routes/post.js");

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", catRoute);

mongoose.connect(process.env.MONGODB_URI);
app.listen(process.env.PORT, () => console.log("server running on post 5000"));
