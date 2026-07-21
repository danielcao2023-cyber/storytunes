import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  imageUrl: string,
  publicId: string
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      folder: 'storytunes',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return imageUrl;
  }
}
