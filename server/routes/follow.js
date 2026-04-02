import express from "express";
import { toggleFollow } from "../controllers/followController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:id", authMiddleware, toggleFollow);

export default router;