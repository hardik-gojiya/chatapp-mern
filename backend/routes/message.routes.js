import express from "express";
import { Router } from "express";
import {
  getuserfordashboard,
  getmessages,
  sendmessage,
  deleteMsg,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/allusers", protectRoute, getuserfordashboard);
router.get("/chat/:id", protectRoute, getmessages);
router.post(
  "/send/:id",
  protectRoute,
  upload.single("selectedFile"),
  sendmessage
);
router.delete("/delete/:id", protectRoute, deleteMsg);

export default router;
