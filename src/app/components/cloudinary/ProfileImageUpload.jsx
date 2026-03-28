// components/ProfileImageUpload.jsx
'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { uploadProfileImage } from './actions';

export default function ProfileImageUpload({ initialImageUrl }) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    setError(null); // Clear previous errors
    const file = event.target.files?.[0];

    if (!file) {
      setError('No file selected.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    startTransition(async () => {
      const response = await uploadProfileImage(formData);
      if (response.success && response.imageUrl) {
        setImageUrl(response.imageUrl);
      } else {
        setError(response.message || 'Failed to upload image.');
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      <div className="relative flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-full border-2 border-gray-300 bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Profile"
            width={150}
            height={150}
            className="rounded-full object-cover"
            priority // Prioritize loading the profile image
          />
        ) : (
          <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-gray-200 text-gray-500">
            No Image
          </div>
        )}
        {isPending && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 font-bold text-gray-800">
            <p>Uploading...</p>
            {/* You can replace this with a more sophisticated spinner */}
            <div className="h-[30px] w-[30px] animate-spin rounded-full border-4 border-gray-200 border-l-blue-500"></div>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isPending}
        className="mt-4 block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

    </div>
  );
}
