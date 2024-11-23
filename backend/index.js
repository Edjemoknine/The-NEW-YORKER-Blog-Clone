const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dostenv = require("dotenv");
const mongoose = require("mongoose");
dostenv.config();

app.use(express.json());
app.use(
  cors({
    origin: ['https://the-new-yorker-blog-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
);


app.use(cookieParser());

// Add a test route to verify the API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const catRoute = require("./routes/category.js");
const postRoute = require("./routes/post.js");

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", catRoute);




// Handle 404 - Keep this after all valid routes
app.use((req, res) => {
  console.log('Not found:', req.originalUrl);
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    status: 404
  });
});

// Error handling middleware - Keep this last
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

