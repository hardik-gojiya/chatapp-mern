import express from "express";
import {
  handleOtp,
  userLogout,
  checkAuth,
  updateUserProfile,
  fetchUser,
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
router.get("/fetchuser/:id", fetchUser);

export default router;
