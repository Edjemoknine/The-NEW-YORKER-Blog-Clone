const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dostenv = require("dotenv");
const mongoose = require("mongoose");

app.use(express.json());
app.use(
  cors()
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
// Add a test route to verify the API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// mongoose.connect(process.env.MONGODB_URI);
// app.listen(process.env.PORT, () => console.log("server running on post 5000"));
