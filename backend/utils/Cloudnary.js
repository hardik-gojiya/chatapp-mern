import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnClodinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "chat-app/profile-pics",
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
  const part = cloudinarypath.split("/");
  const folder = part[part.length - 2];
  const file = part[part.length - 1];

  const deletref = await cloudinary.uploader.destroy(`${folder}/${file}`);
  return deletref;
};

export { uploadOnClodinary, deleteFromCloudinary };
