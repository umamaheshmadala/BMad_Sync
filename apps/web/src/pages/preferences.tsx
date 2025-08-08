import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../api/user'; // Assuming you have these API functions

interface PrivacySettings {
  adFrequency: 'low' | 'medium' | 'high';
  excludeCategories: string[];
}

const Preferences: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    adFrequency: 'medium',
    excludeCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const userData = await getUserProfile(user.id);
        if (userData?.privacy_settings) {
          setPrivacySettings(userData.privacy_settings);
        }
      } catch (err) {
        setError('Failed to fetch preferences.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchPreferences();
    }
  }, [user, authLoading]);

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrivacySettings(prev => ({ ...prev, adFrequency: e.target.value as 'low' | 'medium' | 'high' }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setPrivacySettings(prev => {
      const newExcludeCategories = checked
        ? [...prev.excludeCategories, value]
        : prev.excludeCategories.filter(cat => cat !== value);
      return { ...prev, excludeCategories: newExcludeCategories };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setError('User not logged in.');
      return;
    }
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await updateUserProfile(user.id, { privacy_settings: privacySettings });
      setSuccess('Preferences updated successfully!');
    } catch (err) {
      setError('Failed to update preferences.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && authLoading) {
    return <div className="text-center mt-8">Loading preferences...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-sm border border-border mt-8">
      <h2 className="text-2xl font-bold mb-6">Ad Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="adFrequency" className="block text-sm font-bold mb-2 text-muted-foreground">
            Ad Frequency:
          </label>
          <select
            id="adFrequency"
            name="adFrequency"
            value={privacySettings.adFrequency}
            onChange={handleFrequencyChange}
            className="border border-border rounded w-full py-2 px-3 bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2 text-muted-foreground">
            Exclude Categories:
          </label>
          <div className="flex flex-wrap gap-4">
            {[ 'Food', 'Shopping', 'Tech', 'Travel', 'Wellness', 'Sports' ].map(category => (
              <label key={category} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="excludeCategories"
                  value={category}
                  checked={privacySettings.excludeCategories.includes(category)}
                  onChange={handleCategoryChange}
                  className="form-checkbox h-5 w-5 text-primary"
                />
                <span className="ml-2">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Preferences;
