import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadMedia = async (fileBuffer: Buffer, folder: string) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: `portfolio/${folder}`, format: 'webp' },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) reject(error);
        else if (result) resolve(result);
      }
    ).end(fileBuffer);
  });
};

export default cloudinary;