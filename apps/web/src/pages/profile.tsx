import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getUserProfile } from '../api/user';
// Avoid Link in tests unless wrapped; keep route-agnostic for unit tests
// import { Link } from 'react-router-dom';

interface UserProfileView {
  full_name: string;
  preferred_name?: string;
  avatar_url?: string;
  city?: string;
  interests?: string[];
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfileView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isE2eMock = Boolean((globalThis as any).__VITE_E2E_MOCK__);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        if (isE2eMock) {
          try {
            const raw = localStorage.getItem('e2e-user-profile');
            if (raw) {
              setProfile(JSON.parse(raw));
            } else {
              setProfile({
                full_name: 'E2E User',
                preferred_name: 'E2E',
                avatar_url: '',
                city: 'london',
                interests: ['Food','Tech'],
              } as any);
            }
            return;
          } finally {
            setLoading(false);
          }
        }
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const userId = session.user.id;
        const result: any = await getUserProfile(userId);
        const profileData = (result && typeof result === 'object' && 'data' in result) ? (result as any).data : result;
        setProfile(profileData as any);
        } else {
          setError("User not logged in.");
        }
      } catch (err: any) {
        setError(`Error fetching profile: ${err.message}`);
      } finally {
        if (!isE2eMock) setLoading(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 dark:bg-gray-900 p-8 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white dark:text-gray-100">
            User Profile
          </h2>
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="mx-auto h-24 w-24 rounded-full object-cover mt-4"
            />
          )}
          <p className="mt-2 text-center text-gray-300 dark:text-gray-400">
            Full Name: {profile.full_name}
          </p>
          <p className="mt-1 text-center text-gray-300 dark:text-gray-400">
            Preferred Name: {profile.preferred_name || 'N/A'}
          </p>
          <p className="mt-1 text-center text-gray-300 dark:text-gray-400">
            City: {profile.city || 'N/A'}
          </p>
          <p className="mt-1 text-center text-gray-300 dark:text-gray-400">
            Interests: {profile.interests && profile.interests.length > 0 ? profile.interests.join(', ') : 'N/A'}
          </p>
          <div className="mt-6 text-center">
            <a href="/edit-profile/city-interests" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Edit City & Interests
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
