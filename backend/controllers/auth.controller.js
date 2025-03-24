import twilio from "twilio";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, mobileno: user.mobileno },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const handleOtp = async (req, res) => {
  const { mobileno, otp, action } = req.body;

  if (!mobileno) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    if (action === "send") {
      const newotp = generateOtp();
      let user = await User.findOne({ mobileno: String(mobileno) });

      if (!user) {
        user = new User({ mobileno: String(mobileno), otp: String(newotp) });
      } else {
        user.otp = String(newotp);
      }

      await user.save();

      await client.messages.create({
        body: `Your OTP for login chatapp is ${newotp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${mobileno}`,
      });

      return res.status(200).json({ message: "OTP sent successfully" });
    }
    if (action === "verify") {
      const user = await User.findOne({ mobileno: String(mobileno) });

      if (user && user.otp === String(otp)) {
        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        const token = generateToken(user);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        return res.status(200).json({ message: "OTP verified successfully" });
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    }
    res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const userLogout = async (req, res) => {
  const { mobileno } = req.body;

  try {
    const user = await User.findOne({ mobileno: String(mobileno) });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.isVerified = false;
    await user.save();
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
};

export { handleOtp, userLogout };
