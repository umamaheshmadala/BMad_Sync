import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OnboardingCityInterests = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useAuth();

  console.log("OnboardingCityInterests: userProfile", userProfile);

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

  const handleInterestChange = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedInterests.length < 5) {
      setError('Please select at least 5 interests.');
      return;
    }

    try {
      await updateUserProfile({
        city: selectedCity,
        interests: selectedInterests,
        onboarding_complete: true,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-sm border border-border w-full max-w-3xl">
        <h2 className="text-3xl font-extrabold mb-8 text-center">Welcome! Tell us about yourself.</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-muted-foreground mb-1">Select your City</label>
            <select
              id="city"
              name="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              required
              className="appearance-none block w-full px-4 py-2 border rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-ring focus:border-ring sm:text-sm bg-muted text-foreground"
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
            <label className="block text-sm font-medium text-muted-foreground mb-1">Select at least 5 Interests</label>
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
                    className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                  />
                  <label htmlFor={interest} className="ml-2 text-sm text-muted-foreground">
                    {interest}
                  </label>
                </div>
              ))}
            </div>
            {error && <p className="text-destructive text-sm mt-2 text-center">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition duration-150 ease-in-out"
          >
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingCityInterests;
