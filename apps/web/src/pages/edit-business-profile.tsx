
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // Assuming you have this client setup
// import { BusinessProfile } from '@sync/shared-types'; // Assuming shared types

const EditBusinessProfile: React.FC = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [googleLocationUrl, setGoogleLocationUrl] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [openTimes, setOpenTimes] = useState('');
  const [closeTimes, setCloseTimes] = useState('');
  const [holidays, setHolidays] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Dummy business_id for now, replace with actual user's business_id from auth context
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not logged in');
      }
      const business_id = user.data.user.id; // Using user ID as business ID for now

      let logo_url = '';
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${business_id}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('business-logos')
          .upload(fileName, logoFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) throw uploadError;
        logo_url = data.path;
      }

      const { error: dbError } = await supabase
        .from('businesses')
        .upsert({
          business_id: business_id,
          email: user.data.user.email,
          business_name: businessName,
          address: address,
          google_location_url: googleLocationUrl,
          contact_info: contactInfo,
          open_times: openTimes, // These fields will need proper handling (e.g., JSONB)
          close_times: closeTimes,
          holidays: holidays,
          logo_url: logo_url,
        } as any);

      if (dbError) throw dbError;

      alert('Business profile updated successfully!');
      navigate('/business-profile'); // Navigate to the viewing page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Business Profile</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="businessName" className="block text-gray-700 text-sm font-bold mb-2">
              Business Name:
            </label>
            <input
              type="text"
              id="businessName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
            {!businessName && <p className="text-red-500 text-xs italic">Business Name is required.</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
              Address:
            </label>
            <input
              type="text"
              id="address"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            {!address && <p className="text-red-500 text-xs italic">Address is required.</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="googleLocationUrl" className="block text-gray-700 text-sm font-bold mb-2">
              Google Location URL:
            </label>
            <input
              type="url"
              id="googleLocationUrl"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={googleLocationUrl}
              onChange={(e) => setGoogleLocationUrl(e.target.value)}
            />
            {googleLocationUrl && !/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(googleLocationUrl) && <p className="text-red-500 text-xs italic">Invalid URL format.</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="contactInfo" className="block text-gray-700 text-sm font-bold mb-2">
              Contact Info (Email/Phone):
            </label>
            <input
              type="text"
              id="contactInfo"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="openTimes" className="block text-gray-700 text-sm font-bold mb-2">
              Open Times:
            </label>
            <input
              type="text"
              id="openTimes"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={openTimes}
              onChange={(e) => setOpenTimes(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="closeTimes" className="block text-gray-700 text-sm font-bold mb-2">
              Close Times:
            </label>
            <input
              type="text"
              id="closeTimes"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={closeTimes}
              onChange={(e) => setCloseTimes(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="holidays" className="block text-gray-700 text-sm font-bold mb-2">
              Holidays:
            </label>
            <input
              type="text"
              id="holidays"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={holidays}
              onChange={(e) => setHolidays(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="logo" className="block text-gray-700 text-sm font-bold mb-2">
              Logo:
            </label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleFileChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={Boolean(loading || !businessName || !address || (googleLocationUrl && !/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(googleLocationUrl)))}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBusinessProfile;
