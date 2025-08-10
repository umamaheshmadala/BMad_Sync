import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getBusinessProfile } from '../api/business';
import { BusinessProfile } from '@sync/shared-types';
import { useNavigate } from 'react-router-dom';

const BusinessProfilePage: React.FC = () => {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isE2eMock = Boolean((globalThis as any).__VITE_E2E_MOCK__);

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        if (isE2eMock) {
          // Synchronous fast-path in mock mode
          try {
            const raw = localStorage.getItem('e2e-business-profile');
            setBusinessProfile(raw ? JSON.parse(raw) : null);
          } catch {
            setBusinessProfile(null);
          }
          setLoading(false);
          return;
        } else {
          const user = await supabase.auth.getUser();
          if (!user.data.user) {
            throw new Error('User not logged in');
          }
          const business_id = user.data.user.id; // Assuming user ID as business ID
          const data = await getBusinessProfile(business_id);
          setBusinessProfile(data as any);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        if (!isE2eMock) setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, []);

  if (loading && !isE2eMock) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading business profile...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500">Error: {error}</div>;
  }

  if (!businessProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p>No business profile found. Please create one.</p>
          <button
            onClick={() => navigate('/edit-business-profile')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Business Profile</h2>
        <div className="mb-4 text-center">
          {(businessProfile as any).logo_url && (
            <img
              src={`${supabase.storage.from('business-logos').getPublicUrl((businessProfile as any).logo_url).data.publicUrl}`}
              alt="Business Logo"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
          )}
          <p className="text-xl font-semibold">{businessProfile.business_name}</p>
          <p className="text-gray-600">{(businessProfile as any).email}</p>
        </div>
        <div className="mb-2">
          <p><span className="font-semibold">Address:</span> {(businessProfile as any).address}</p>
        </div>
        <div className="mb-2">
          <p><span className="font-semibold">Google Location:</span> <a href={(businessProfile as any).google_location_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Link</a></p>
        </div>
        <div className="mb-2">
          <p><span className="font-semibold">Contact Info:</span> {(businessProfile as any).contact_info}</p>
        </div>
        <div className="mb-2">
          <p><span className="font-semibold">Open Times:</span> {(businessProfile as any).open_times}</p>
        </div>
        <div className="mb-2">
          <p><span className="font-semibold">Close Times:</span> {(businessProfile as any).close_times}</p>
        </div>
        <div className="mb-4">
          <p><span className="font-semibold">Holidays:</span> {(businessProfile as any).holidays}</p>
        </div>
        <button
          onClick={() => navigate('/edit-business-profile')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Edit Profile
        </button>
        {isE2eMock && (
          <div className="mt-4 text-xs text-gray-500 text-center">Mock mode</div>
        )}
      </div>
    </div>
  );
};

export default BusinessProfilePage;
