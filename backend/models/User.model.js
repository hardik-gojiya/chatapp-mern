import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileno: {
      type: Number,
      unique: true,
    },
    otp: {
      type: String,
    },
    isVerified: { type: Boolean, default: false },
    profilepic: {
      type: String,
      default:
        "data:image/png;base64,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",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
