import twilio from "twilio";
import { User } from "../models/User.model.js";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

const handleOtp = async (req, res) => {
  const { mobileno, otp, action } = req.body;

  if (!mobileno) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    if (action === "send") {
      const newotp = generateOtp(); 
      let user = await User.findOne({ mobileno });

      if (!user) {
        user = new User({ mobileno, otp: newotp });
      } else {
        user.otp = newotp;
      }

      await user.save();

      await client.messages.create({
        body: `Your OTP for login chatapp is ${newotp}`,
        from: process.env.TWILIO_PHONE_NUMBER, 
        to: mobileno,
      });

      return res.status(200).json({ message: "OTP sent successfully" });
    }
    if (action === "verify") {
      const user = await User.findOne({ mobileno });

      if (user && user.otp === otp) {
        user.isVerified = true;
        user.otp = undefined;
        await user.save();

        console.log(user)
        return res.status(400).json({ message: "OTP verified successfully" });
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

export { handleOtp };
