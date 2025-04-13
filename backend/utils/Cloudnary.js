import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnClodinary = async (forwhat, localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: `chat-app/${forwhat}`,
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error: ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (cloudinarypath) => {
  try {
    const part = cloudinarypath.split("/");
    const folder = part[part.length - 2];
    const file = part[part.length - 1].split(".")[0];

    const deletref = await cloudinary.uploader.destroy(
      `chat-app/${folder}/${file}`
    );
    if (deletref.result !== "ok") {
      console.log("Cloudinary Delete Error: ", deletref.result);
      return null;
    }

    return deletref;
  } catch (error) {
    console.error("Cloudinary Delete Error: ", error);
    return null;
  }
};

export { uploadOnClodinary, deleteFromCloudinary };
