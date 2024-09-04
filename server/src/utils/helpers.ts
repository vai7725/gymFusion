import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import fs from 'fs/promises';

const cloudConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    api_key: process.env.CLOUDINARY_API_KEY,
  });
};

export const uploadOnCloudinary = async (
  localFilePath: string,
  uploadOptions: UploadApiOptions
) => {
  try {
    cloudConfig();

    if (!localFilePath) {
      console.log('Local file path is missing');
      return null;
    }

    const res = await cloudinary.uploader.upload(localFilePath, uploadOptions);
    //   all the fields we need according to our schema, will be in the res.
    fs.rm(localFilePath);
    return res;
  } catch (error) {
    fs.rm(localFilePath);
    return error;
  }
};
