import express from "express";
import {
  handleOtp,
  userLogout,
  checkAuth,
  updateUserProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/otp", handleOtp);
router.post("/logout", protectRoute, userLogout);
router.post(
  "/editprofile",
  protectRoute,
  upload.single("profilepic"),
  updateUserProfile
);

router.get("/check-auth", checkAuth);

export default router;
