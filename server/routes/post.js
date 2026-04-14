import express from "express";
import {
  createPost,
  getPostById,
  getPosts,
  updatePost,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { deletePost } from "../controllers/postController.js";


const router = express.Router();

// 🔥 upload + auth
router.post("/", authMiddleware, upload.single("image"), createPost);

// GET
router.get("/", getPosts);
router.get("/:id", authMiddleware, getPostById);

//delete Post 
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, upload.single("image"), updatePost);


export default router;
