import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`MongoDB Connected`))
  .catch((err) => console.log(err));

import userroutes from "./routes/user.routes.js";
app.use("/api", userroutes); 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
