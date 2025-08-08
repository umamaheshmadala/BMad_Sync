import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { supabase } from '../lib/supabaseClient';

const EditUserCityInterests = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile, updateUserProfile } = useAuth();

  const cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose',
  ];

  const interests = [
    'Technology',
    'Sports',
    'Music',
    'Movies',
    'Books',
    'Travel',
    'Food',
    'Fashion',
    'Gaming',
    'Art',
    'Science',
    'History',
    'Politics',
    'Fitness',
    'Photography',
  ];

  useEffect(() => {
    if (userProfile) {
      setSelectedCity(userProfile.city || '');
      setSelectedInterests(userProfile.interests || []);
    }
  }, [userProfile]);

  const handleInterestChange = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (selectedInterests.length < 5) {
      setError('Please select at least 5 interests.');
      setLoading(false);
      return;
    }

    if (!user?.id) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    try {
      await updateUserProfile({
        city: selectedCity,
        interests: selectedInterests,
      });
      alert('Profile updated successfully!');
      navigate('/profile'); // Redirect back to profile page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="bg-gray-800 dark:bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white dark:text-gray-100">Edit City & Interests</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-1">Select your City</label>
            <select
              id="city"
              name="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              required
              className="appearance-none block w-full px-4 py-2 border border-gray-700 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-400 mb-1">Select at least 5 Interests</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {interests.map((interest) => (
                <div key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    id={interest}
                    name="interests"
                    value={interest}
                    checked={selectedInterests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={interest} className="ml-2 text-sm text-gray-300 dark:text-gray-400">
                    {interest}
                  </label>
                </div>
              ))}
            </div>
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition duration-150 ease-in-out"
            disabled={loading}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserCityInterests;
