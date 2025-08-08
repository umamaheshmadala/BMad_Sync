import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { StorefrontProfile } from '@sync/shared-types'; // Assuming shared types

const EditBusinessStorefront: React.FC = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [theme, setTheme] = useState('default'); // default theme
  const [isOpen, setIsOpen] = useState(true); // default to open
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch existing storefront data if available
    const fetchStorefront = async () => {
      setLoading(true);
      try {
        const user = await supabase.auth.getUser();
        if (!user.data.user) {
          throw new Error('User not logged in');
        }
        const business_id = user.data.user.id;

        const response = await fetch(`/api/business/storefront?business_id=${business_id}`);
        const data = await response.json();

        if (response.ok && data) {
          setDescription(data.description || '');
          setContactDetails(data.contact_details || '');
          setTheme(data.theme || 'default');
          setIsOpen(data.is_open !== undefined ? data.is_open : true);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStorefront();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBannerFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not logged in');
      }
      const business_id = user.data.user.id;

      let banner_url = '';
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `${business_id}-banner.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('storefront-banners')
          .upload(fileName, bannerFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) throw uploadError;
        banner_url = data.path;
      }

      const storefrontData: Partial<StorefrontProfile> = {
        business_id: business_id,
        description,
        contact_details: contactDetails,
        theme,
        is_open: isOpen,
        promotional_banner_url: banner_url,
      };

      const response = await fetch('/api/business/storefront', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storefrontData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save storefront');
      }

      alert('Storefront updated successfully!');
      navigate('/business-storefront');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const themeOptions = [
    { value: 'default', label: 'Default Theme' },
    { value: 'seasonal-spring', label: 'Seasonal: Spring' },
    { value: 'seasonal-summer', label: 'Seasonal: Summer' },
    { value: 'seasonal-autumn', label: 'Seasonal: Autumn' },
    { value: 'seasonal-winter', label: 'Seasonal: Winter' },
    { value: 'festival-holiday', label: 'Festival: Holiday' },
    { value: 'festival-halloween', label: 'Festival: Halloween' },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading storefront data...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Storefront</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description:
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            ></textarea>
            {!description && <p className="text-red-500 text-xs italic">Description is required.</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="contactDetails" className="block text-gray-700 text-sm font-bold mb-2">
              Contact Details:
            </label>
            <input
              type="text"
              id="contactDetails"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
              required
            />
            {!contactDetails && <p className="text-red-500 text-xs italic">Contact Details are required.</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="theme" className="block text-gray-700 text-sm font-bold mb-2">
              Storefront Theme:
            </label>
            <select
              id="theme"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {themeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="isOpen" className="block text-gray-700 text-sm font-bold mb-2">
              Online/Offline Status:
            </label>
            <input
              type="checkbox"
              id="isOpen"
              className="mr-2 leading-tight"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
            />
            <span className="text-sm">{isOpen ? 'Online' : 'Offline'}</span>
          </div>

          <div className="mb-4">
            <label htmlFor="banner" className="block text-gray-700 text-sm font-bold mb-2">
              Promotional Banner:
            </label>
            <input
              type="file"
              id="banner"
              accept="image/*"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleFileChange}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading || !description || !contactDetails}
          >
            {loading ? 'Saving...' : 'Save Storefront'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBusinessStorefront;
