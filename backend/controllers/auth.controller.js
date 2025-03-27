import twilio from "twilio";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import dotenv from "dotenv";
import { uploadOnClodinary } from "../utils/Cloudnary.js";

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
    return res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred" });
  }
};

const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ isLoggedIn: false, message: "Invalid token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ mobileno: decoded.mobileno });

    return res.status(200).json({
      isLoggedIn: true,
      userId: user._id,
      mobile: decoded.mobileno,
      name: user.name || "",
      profilepic: user.profilepic,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ isLoggedIn: false, message: "Invalid token" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, mobileno } = req.body;
    const profilepic = req.file?.path;

    const user = await User.findOne({ mobileno: Number(mobileno) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
    }

    if (profilepic) {
      const cloudinarypic = await uploadOnClodinary(profilepic);

      if (cloudinarypic && cloudinarypic.url) {
        user.profilepic = cloudinarypic.url;
      } else {
        console.log("Error uploading to Cloudinary");
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    await user.save();
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.log("Error in update profile: ", error);
    return res.status(500).json({ message: "An error occurred" });
  }
};
const fetchUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (user) {
      const name = user.name;
      const mobileno = user.mobileno;
      const profilepic = user.profilepic;
      return res.status(200).json({ name, mobileno, profilepic });
    }
  } catch (error) {
    console.log("error while fetching user", error);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    

    if (user) {
      return res
        .status(200)
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        })
        .json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    } 
  } catch (error) {
    console.log("error while deleting user", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting profile" });
  }
};

export {
  handleOtp,
  userLogout,
  checkAuth,
  updateUserProfile,
  fetchUser,
  deleteUser,
};
