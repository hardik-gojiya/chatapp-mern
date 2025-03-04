import express from "express";
import { handleOtp, userLogout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/otp", handleOtp);
router.post("/logout", userLogout);

export default router;
