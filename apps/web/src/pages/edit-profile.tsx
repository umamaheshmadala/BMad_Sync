import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { uploadAvatar, createUserProfile, updateUserProfile, getUserProfile } from '../api/user';

interface ProfileFormErrors {
  fullName?: string;
  avatarFile?: string;
}

const EditProfile = () => {
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const effectiveId = session?.user?.id || ((): string | null => {
        try { return JSON.parse(localStorage.getItem('e2e-session') || 'null')?.user?.id ?? null; } catch { return null; }
      })();
      if (effectiveId) {
        setUserId(effectiveId);
        try {
          const profileData: any = await getUserProfile(effectiveId as string);
          const pdata = profileData?.data ?? profileData;
          if (pdata) {
            setFullName(pdata.full_name || '');
            setPreferredName(pdata.preferred_name || '');
            setProfileExists(true);
          }
        } catch (err: any) {
          if (err.message === "User profile not found") {
            setProfileExists(false);
          } else {
            setError(`Error fetching profile: ${err.message}`);
          }
        }
      } else {
        setError("User not logged in.");
      }
    };
    getSessionAndProfile();
  }, []);

  const validateForm = () => {
    const errors: ProfileFormErrors = {};
    if (!fullName.trim()) {
      errors.fullName = "Full Name is required.";
    }
    if (avatarFile && avatarFile.size > 5 * 1024 * 1024) { // 5MB limit
      errors.avatarFile = "Avatar file size should not exceed 5MB.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFormErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    let ensuredUserId = userId;
    if (!ensuredUserId) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        ensuredUserId = session?.user?.id ?? null;
      } catch {}
    }
    if (!ensuredUserId) {
      setError("User ID not available.");
      setLoading(false);
      return;
    }

    let avatarUrl = '';
    if (avatarFile) {
      try {
        avatarUrl = await uploadAvatar(ensuredUserId, avatarFile);
      } catch (err: any) {
        const isE2eMock = Boolean((globalThis as any).__VITE_E2E_MOCK__);
        const msg = err?.message || '';
        // Gracefully handle missing buckets in non-mock runs by surfacing a user-friendly message
        if (!isE2eMock && /bucket.*not.*found|no such bucket/i.test(msg)) {
          setError('Error uploading avatar: Bucket not found');
        } else {
          setError(`Error uploading avatar: ${msg}`);
        }
        setLoading(false);
        return;
      }
    }

    const profileData = {
      userId: ensuredUserId,
      fullName,
      preferredName,
      ...(avatarUrl && { avatarUrl }),
    };

    try {
      if (profileExists) {
        await updateUserProfile(ensuredUserId, profileData);
        setSuccessMessage("Profile updated successfully!");
      } else {
        await createUserProfile(profileData);
        setProfileExists(true);
        setSuccessMessage("Profile created successfully!");
      }
      } catch (err: any) {
        setError(`Error saving profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 dark:bg-gray-900 p-8 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white dark:text-gray-100">
            Create/Edit Profile
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="full-name" className="sr-only">Full Name</label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-white bg-gray-700 dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {formErrors.fullName && <p className="text-red-400 text-xs mt-1">{formErrors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="preferred-name" className="sr-only">Preferred Name</label>
              <input
                id="preferred-name"
                name="preferredName"
                type="text"
                autoComplete="nickname"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-white bg-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
                placeholder="Preferred Name (Optional)"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="avatar-upload" className="sr-only">Avatar</label>
              <input
                id="avatar-upload"
                name="avatar"
                type="file"
                accept="image/*"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-white bg-gray-700 dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
                onChange={handleAvatarChange}
              />
              {formErrors.avatarFile && <p className="text-red-400 text-xs mt-1">{formErrors.avatarFile}</p>}
            </div>
          </div>

          {loading && <p className="text-center text-primary">Saving profile...</p>}
          {error && <p className="text-center text-red-400">{error}</p>}
          {successMessage && <p className="text-center text-green-500">{successMessage}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
              disabled={loading}
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
