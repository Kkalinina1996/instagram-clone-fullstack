import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

//  добавить комментарий
router.post("/:postId", authMiddleware, addComment);

// получить комментарии
router.get("/:postId", getComments);

export default router;