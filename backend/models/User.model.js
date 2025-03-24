import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  mobileno: {
    type: Number,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
  },
  isVerified: { type: Boolean, default: false },
  profilepic: {
    type: String,
    default: "",
  },
});

export const User = mongoose.model("User", userSchema);
