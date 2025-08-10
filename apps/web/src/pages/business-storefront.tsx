import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { StorefrontProfile, StorefrontProduct } from '@sync/shared-types';
import { useAuth } from '../context/AuthContext';
import { favoriteBusiness, unfavoriteBusiness, getFavorites } from '../api/favorites';
import { useNavigate } from 'react-router-dom';
import { getStorefront } from '../api/storefront';

const BusinessStorefrontPage: React.FC = () => {
  const [storefront, setStorefront] = useState<StorefrontProfile | null>(null);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const isE2eMock = Boolean((globalThis as any).__VITE_E2E_MOCK__);

  useEffect(() => {
    const fetchStorefrontAndProducts = async () => {
      setLoading(true);
      try {
        if (isE2eMock) {
          try {
            const raw = localStorage.getItem('e2e-storefront');
            setStorefront(raw ? JSON.parse(raw) as any : null);
          } catch {
            setStorefront(null);
          }
          setLoading(false);
          return;
        } else {
          const user = await supabase.auth.getUser();
          if (!user.data.user) {
            throw new Error('User not logged in');
          }
          const business_id = user.data.user.id;
          try {
            const storefrontData = await getStorefront(business_id);
            if (storefrontData) setStorefront(storefrontData as any);
          } catch (e: any) {
            if (/Not Found/i.test(e?.message || '')) {
              setStorefront(null);
            } else {
              throw e;
            }
          }
        }

        // Load favorite status for this business storefront (if viewing as a user)
        if (!isE2eMock && user.data.user && user.data.user.id) {
          try {
            const favorites = await getFavorites(user.data.user.id);
            setIsFavorite(favorites.businesses.includes(business_id));
          } catch (_) {
            // ignore
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        if (!isE2eMock) setLoading(false);
      }
    };

    fetchStorefrontAndProducts();
  }, []);

  if (loading && !isE2eMock) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6">Your Storefront</h2>
          <p>Loading storefront...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6">Your Storefront</h2>
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!storefront) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6">Your Storefront</h2>
          <p className="text-gray-700">No storefront found. Please create one.</p>
          <button
            onClick={() => navigate('/edit-business-storefront')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Storefront
          </button>
          {isE2eMock && (
            <div className="mt-4 text-xs text-gray-500">Mock mode</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Storefront</h2>
        {user?.id && storefront && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={async () => {
                if (!user?.id) return;
                try {
                  setFavoriteError(null);
                  if (isFavorite) {
                    await unfavoriteBusiness(user.id, storefront.business_id);
                    setIsFavorite(false);
                  } else {
                    await favoriteBusiness(user.id, storefront.business_id);
                    setIsFavorite(true);
                  }
                } catch (e) {
                  console.error(e);
                  setFavoriteError('Failed to update favorite. Please try again.');
                }
              }}
              className={`px-3 py-1 rounded text-sm ${isFavorite ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
            >
              {isFavorite ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        )}
        {favoriteError && (
          <div className="mb-2 text-center text-sm text-red-600" role="alert">
            {favoriteError}
          </div>
        )}
        <div className="mb-4 text-center">
          {storefront.promotional_banner_url && (
            <img
              src={`${supabase.storage.from('storefront-banners').getPublicUrl(storefront.promotional_banner_url).data.publicUrl}`}
              alt="Promotional Banner"
              className="w-full h-48 object-cover mb-4 rounded"
            />
          )}
          <p className="text-xl font-semibold">Status: {storefront.is_open ? 'Online' : 'Offline'}</p>
          <p className="text-gray-600">Theme: {storefront.theme}</p>
        </div>
        <div className="mb-2">
          <p><span className="font-semibold">Description:</span> {storefront.description}</p>
        </div>
        <div className="mb-2">
          <p><span className="font-semibold">Contact Details:</span> {storefront.contact_details}</p>
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4 text-center">Featured Products</h3>
        {products.length === 0 ? (
          <div className="text-center text-gray-500">
            No products to display. Add some from the <button onClick={() => navigate('/business-storefront-products')} className="text-blue-500 underline">product management page</button>.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.product_id} className="border rounded-lg p-2 text-center">
                {product.product_image_url && (
                  <img
                    src={`${supabase.storage.from('product-images').getPublicUrl(product.product_image_url).data.publicUrl}`}
                    alt={product.product_name}
                    className="w-full h-24 object-cover mb-2 rounded"
                  />
                )}
                <p className="font-semibold text-sm">{product.product_name}</p>
                <p className="text-gray-600 text-xs line-clamp-2">{product.product_description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate('/edit-business-storefront')}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Edit Storefront
          </button>
          <button
            onClick={() => navigate('/business-storefront-products')}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Manage Products
          </button>
        </div>
        {isE2eMock && (
          <div className="mt-4 text-xs text-gray-500 text-center">Mock mode</div>
        )}
      </div>
    </div>
  );
};

export default BusinessStorefrontPage;
