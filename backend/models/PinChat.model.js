import mongoose from "mongoose";
import { User } from "./User.model.js";

const pinchatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: User },
    pinUsers: [
      {
        pin: { type: mongoose.Schema.Types.ObjectId, ref: User },
      },
    ],
  },
  { timestamps: true }
);

export const PinChat = mongoose.model("PinChat", pinchatSchema);
