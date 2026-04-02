import express from "express";
import {
  getNotifications,
  markAsRead
} from "../controllers/notificationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

//  получить уведомления
router.get("/", authMiddleware, getNotifications);

//  прочитать все
router.put("/read", authMiddleware, markAsRead);

export default router;