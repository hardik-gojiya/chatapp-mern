import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { app, server } from "./utils/Soket.js";
import path from "path";

import status from "express-status-monitor";
app.use(status());

const _dirname = path.resolve();

dotenv.config();

const PORT = process.env.PORT;

const corsOptions = {
  origin: [
    "http://localhost:5174",
    "https://chat-in-uanp.onrender.com",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`MongoDB Connected`))
  .catch((err) => console.log(err));

import userroutes from "./routes/user.routes.js";
import messageRoute from "./routes/message.routes.js";
app.use("/api/users", userroutes);
app.use("/api/message", messageRoute);

// deploy
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
