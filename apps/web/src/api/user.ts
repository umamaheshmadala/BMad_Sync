import { supabase } from '../lib/supabaseClient';

const isE2eMock = Boolean((globalThis as any).__VITE_E2E_MOCK__);

export const uploadAvatar = async (userId: string, file: File) => {
  if (isE2eMock) {
    return `http://localhost/avatars/${userId}.png`;
  }
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
  if (isE2eMock) {
    localStorage.setItem('e2e-user-profile', JSON.stringify({
      user_id: profileData.userId,
      full_name: profileData.fullName ?? '',
      preferred_name: profileData.preferredName ?? '',
      avatar_url: profileData.avatarUrl ?? '',
      city: 'london',
      interests: ['Food','Tech','Sports','Movies','Books'],
      privacy_settings: { adFrequency: 'medium', excludeCategories: [] },
    }));
    return { success: true } as any;
  }
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

interface PrivacySettings {
  adFrequency: 'low' | 'medium' | 'high';
  excludeCategories: string[];
}

interface UserProfileUpdateData {
  fullName?: string;
  preferredName?: string;
  avatarUrl?: string;
  city?: string;
  interests?: string[];
  privacy_settings?: PrivacySettings;
}

export const updateUserProfile = async (userId: string, profileData: UserProfileUpdateData) => {
  if (isE2eMock) {
    const existingRaw = localStorage.getItem('e2e-user-profile');
    const existing = existingRaw ? JSON.parse(existingRaw) : { user_id: userId };
    const merged = { ...existing, ...profileData };
    localStorage.setItem('e2e-user-profile', JSON.stringify(merged));
    return { success: true } as any;
  }
  const response = await fetch(`/api/user/preferences?userId=${userId}`, {
    method: 'PUT',
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
  if (isE2eMock) {
    const raw = localStorage.getItem('e2e-user-profile');
    if (raw) return JSON.parse(raw);
    return {
      user_id: userId,
      email: 'e2e@example.com',
      full_name: 'E2E User',
      preferred_name: 'E2E',
      city: 'london',
      interests: ['Food','Tech','Sports','Movies','Books'],
      privacy_settings: { adFrequency: 'medium', excludeCategories: [] },
    } as any;
  }
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
