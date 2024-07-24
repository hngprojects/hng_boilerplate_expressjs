import * as cloudinary from "cloudinary";
import { ConfigOptions } from "cloudinary";

const cloudinaryConfig = (
  cloudName: string,
  apiKey: string,
  apiSecret: string,
): ConfigOptions => {
  return cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

export default cloudinaryConfig;
