import { supabase } from '../lib/supabaseClient';

export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars') // Assuming you have a bucket named 'avatars'
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

interface UserProfileData {
  userId: string;
  fullName?: string;
  preferredName?: string;
  avatarUrl?: string;
}

export const createUserProfile = async (profileData: UserProfileData) => {
  const response = await fetch('/api/user/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create user profile');
  }

  return response.json();
};

export const updateUserProfile = async (profileData: UserProfileData) => {
  const response = await fetch('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update user profile');
  }

  return response.json();
};

export const getUserProfile = async (userId: string) => {
  const response = await fetch(`/api/user/get?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch user profile');
  }

  return response.json();
};
