import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import likeRoutes from "./routes/like.js";
import commentRoutes from "./routes/comment.js"
import userRoutes from "./routes/user.js";
import searchRoutes from "./routes/search.js"
import notificationRoutes from "./routes/notification.js";
import followRoutes from "./routes/follow.js";

dotenv.config();

const app = express(); // ✅ СНАЧАЛА создаём app

const dbURI = process.env.MONGO_URI || "URI";
const port = process.env.PORT || 3333;
const host = process.env.HOST || "http://127.0.0.1";

// DB
connectDB();

// middleware
app.use(express.json());

// routes (теперь можно использовать app)
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes)
app.use("/api/users", userRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/notifications", notificationRoutes);
app.use("/api/follow", followRoutes);

app.get("/", (req, res) => {
  res.send("API работает ");
});

app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);
});