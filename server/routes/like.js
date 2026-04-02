import express from "express";
import { toggleLike } from "../controllers/likeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// лайк / анлайк
router.post("/:postId", authMiddleware, toggleLike);

export default router;