// app/profile/page.jsx
import ProfileImageUpload from '@/components/cloudinary/ProfileImageUpload';
import { Suspense } from 'react';
import Image from 'next/image';

// Mock function to simulate fetching user data
async function getUserProfile() {
  // In a real application, you would fetch this from a database or session
  // For now, let's return a static user with an optional profile image URL
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return {
    name: 'Sahil',
    email: 'sahil@example.com',
    // This could come from your database after an upload
    // For initial load, it might be empty or a default avatar
    profileImageUrl: undefined, // Or a default URL like 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/default_avatar.png'
  };
}

export default async function ProfilePage() {
  const user = await getUserProfile();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Profile</h1>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="mb-6">
          {/* Display current profile image or a placeholder */}
          {user.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt="Current Profile"
              width={150}
              height={150}
              className="rounded-full object-cover mx-auto border-4 border-blue-300"
            />
          ) : (
            <div className="mx-auto flex h-[150px] w-[150px] items-center justify-center rounded-full border-4 border-gray-300 bg-gray-200 text-lg font-semibold text-gray-500">
              No Image
            </div>
          )}
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-2">{user.name}</h2>
        <p className="text-gray-500 mb-6">{user.email}</p>

        <h3 className="text-xl font-medium text-gray-600 mb-4">Upload New Profile Image</h3>
        <Suspense fallback={<div>Loading image uploader...</div>}>
          <ProfileImageUpload initialImageUrl={user.profileImageUrl} />
        </Suspense>
      </div>
    </div>
  );
}
