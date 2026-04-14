import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getConversation,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/:userId", authMiddleware, getConversation);
router.post("/:userId", authMiddleware, sendMessage);

export default router;
