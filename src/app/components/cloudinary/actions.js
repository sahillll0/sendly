'use server';

import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadProfileImage(formData) {
  const file = formData.get('profileImage');

  if (!file || file.size === 0) {
    return { success: false, message: 'No file uploaded.' };
  }

  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'sendly_profile_images', resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      ).end(buffer);
    });

    const result = uploadResult;
    revalidatePath('/profile'); // Revalidate the profile page to show the new image
    return { success: true, imageUrl: result.secure_url };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return { success: false, message: 'Image upload failed.' };
  }
}
