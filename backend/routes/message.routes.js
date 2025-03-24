import express from "express";
import { Router } from "express";
import {
  getuserfordashboard,
  getmessages,
  sendmessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/allusers", protectRoute, getuserfordashboard);
router.get("/:id", protectRoute, getmessages);
router.post("/send/:id", protectRoute, sendmessage);

export default router;
