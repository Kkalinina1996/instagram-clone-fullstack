import express from "express";
import {
  getProfile,
  getUserById,
  updateProfile
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.get("/:id", authMiddleware, getUserById);

// 🔥 ВАЖНО
router.put(
  "/me",
  authMiddleware,
  upload.single("avatar"),
  updateProfile
);

export default router;
