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
  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        try {
          const { data: profileData } = await getUserProfile(session.user.id);
          if (profileData) {
            setFullName(profileData.full_name || '');
            setPreferredName(profileData.preferred_name || '');
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

    if (!userId) {
      setError("User ID not available.");
      setLoading(false);
      return;
    }

    let avatarUrl = '';
    if (avatarFile) {
      try {
        avatarUrl = await uploadAvatar(userId, avatarFile);
      } catch (err: any) {
        setError(`Error uploading avatar: ${err.message}`);
        setLoading(false);
        return;
      }
    }

    const profileData = {
      userId,
      fullName,
      preferredName,
      ...(avatarUrl && { avatarUrl }),
    };

    try {
      if (profileExists) {
        await updateUserProfile(profileData);
        alert("Profile updated successfully!");
      } else {
        await createUserProfile(profileData);
        setProfileExists(true);
        alert("Profile created successfully!");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
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
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="preferred-name" className="sr-only">Preferred Name</label>
              <input
                id="preferred-name"
                name="preferredName"
                type="text"
                autoComplete="nickname"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                onChange={handleAvatarChange}
              />
              {formErrors.avatarFile && <p className="text-red-500 text-xs mt-1">{formErrors.avatarFile}</p>}
            </div>
          </div>

          {loading && <p className="text-center text-indigo-600">Saving profile...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
