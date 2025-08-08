import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { StorefrontProfile, StorefrontProduct } from '../../../packages/shared-types/src';
import { useNavigate } from 'react-router-dom';

const BusinessStorefrontPage: React.FC = () => {
  const [storefront, setStorefront] = useState<StorefrontProfile | null>(null);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStorefrontAndProducts = async () => {
      setLoading(true);
      try {
        const user = await supabase.auth.getUser();
        if (!user.data.user) {
          throw new Error('User not logged in');
        }
        const business_id = user.data.user.id;

        // Fetch storefront profile
        const storefrontResponse = await fetch(`/api/business/storefront?business_id=${business_id}`);
        const storefrontData = await storefrontResponse.json();

        if (storefrontResponse.ok && storefrontData) {
          setStorefront(storefrontData);
          // Fetch products if storefront exists
          const productsResponse = await fetch(`/api/storefronts/${storefrontData.storefront_id}/products`);
          const productsData = await productsResponse.json();
          if (productsResponse.ok && productsData) {
            setProducts(productsData);
          } else if (productsResponse.status !== 404) {
              throw new Error(productsData.error || 'Failed to fetch products');
          }

        } else if (storefrontResponse.status === 404) {
            setStorefront(null); // No storefront found, prompt to create
        } else {
            throw new Error(storefrontData.error || 'Failed to fetch storefront');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStorefrontAndProducts();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading storefront...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500">Error: {error}</div>;
  }

  if (!storefront) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p>No storefront found. Please create one.</p>
          <button
            onClick={() => navigate('/edit-business-storefront')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Storefront</h2>
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
      </div>
    </div>
  );
};

export default BusinessStorefrontPage;
