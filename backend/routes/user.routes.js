import express from "express";
import { handleOtp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/otp", handleOtp);

export default router
