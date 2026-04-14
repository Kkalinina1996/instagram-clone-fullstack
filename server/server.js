import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import likeRoutes from "./routes/like.js";
import commentRoutes from "./routes/comment.js";
import userRoutes from "./routes/user.js";
import searchRoutes from "./routes/search.js";
import notificationRoutes from "./routes/notification.js";
import followRoutes from "./routes/follow.js";
import messageRoutes from "./routes/message.js";
import cors from "cors";
import path from "path";


dotenv.config();

const app = express();

const port = process.env.PORT || 3333;

// DB
connectDB();

// ✅ CORS ДОЛЖЕН БЫТЬ ЗДЕСЬ (очень важно)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/messages", messageRoutes);
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.send("API работает");
});

app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
