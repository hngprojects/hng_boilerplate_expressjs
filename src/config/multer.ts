import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinaryConfig from "./cloudinary";
import * as dotenv from "dotenv";
dotenv.config();

interface CustomParams {
  folder: string;
  allowedFormats: string[];
}

const cloudinaryConfigOptions = cloudinaryConfig(
  process.env["CLOUDINARY_CLOUD_NAME"] as string,
  process.env["CLOUDINARY_API_KEY"] as string,
  process.env["CLOUDINARY_API_SECRET"] as string
);

cloudinary.config(cloudinaryConfigOptions);

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "images",
    allowedFormats: ["jpg", "png", "jpeg"],
  } as CustomParams,
});

const FILE_SIZE = 1024 * 1024 * 2; // 2MB

export const multerConfig = multer({
  storage,
  limits: {
    fileSize: FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"));
    }
    if (file.size > FILE_SIZE) {
      return cb(new Error("Image should not be more than 4MB"));
    }
    cb(null, true);
  },
});

export { cloudinary };

