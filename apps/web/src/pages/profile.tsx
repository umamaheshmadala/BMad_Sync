import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getUserProfile } from '../api/user';

interface UserProfile {
  full_name: string;
  preferred_name: string;
  avatar_url: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const userId = session.user.id;
          const { data: profileData } = await getUserProfile(userId);
          setProfile(profileData);
        } else {
          setError("User not logged in.");
        }
      } catch (err: any) {
        setError(`Error fetching profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading profile...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600">Error: {error}</p></div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center"><p>No profile found. Please create one.</p></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            User Profile
          </h2>
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="mx-auto h-24 w-24 rounded-full object-cover mt-4"
            />
          )}
          <p className="mt-2 text-center text-sm text-gray-600">
            Full Name: {profile.full_name}
          </p>
          <p className="mt-1 text-center text-sm text-gray-600">
            Preferred Name: {profile.preferred_name || 'N/A'}
          </p>
          {/* Add more profile details as needed */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
