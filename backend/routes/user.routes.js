import express from "express";
import {
  handleOtp,
  userLogout,
  checkAuth
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/otp", handleOtp);
router.post("/logout",protectRoute, userLogout);

router.get("/check-auth", checkAuth);

export default router;
