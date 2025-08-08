import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { StorefrontProduct } from '../../../packages/shared-types/src';

interface ProductInput {
  id: string;
  name: string;
  description: string;
  imageFile: File | null;
  imageUrl: string; // For displaying existing images
  isTrending?: boolean; // Added for trending suggestions
}

const BusinessStorefrontProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductInput[]>(
    Array.from({ length: 4 }, (_, i) => ({ id: `new-${i}`, name: '', description: '', imageFile: null, imageUrl: '' }))
  );
  const [trendingProducts, setTrendingProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storefrontId, setStorefrontId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorefrontAndProducts = async () => {
      setLoading(true);
      try {
        const user = await supabase.auth.getUser();
        if (!user.data.user) {
          throw new Error('User not logged in');
        }
        const business_id = user.data.user.id;

        // First, get the storefront_id for the business
        const storefrontResponse = await fetch(`/api/business/storefront?business_id=${business_id}`);
        const storefrontData = await storefrontResponse.json();

        if (!storefrontResponse.ok || !storefrontData || !storefrontData.storefront_id) {
          throw new Error(storefrontData.error || 'Storefront not found. Please create your storefront first.');
        }
        setStorefrontId(storefrontData.storefront_id);

        // Then, fetch existing products for that storefront
        const productsResponse = await fetch(`/api/storefronts/${storefrontData.storefront_id}/products`);
        const productsData = await productsResponse.json();

        if (productsResponse.ok && productsData && productsData.length > 0) {
          const fetchedProducts: ProductInput[] = productsData.map((product: StorefrontProduct) => ({
            id: product.product_id,
            name: product.product_name,
            description: product.product_description,
            imageFile: null,
            imageUrl: product.product_image_url,
          }));
          setProducts(fetchedProducts);
        } else if (productsResponse.status !== 404) {
             throw new Error(productsData.error || 'Failed to fetch existing products');
        }

        // Fetch trending products
        const trendingResponse = await fetch('/api/trending-products');
        const trendingData = await trendingResponse.json();
        if (trendingResponse.ok && trendingData) {
          setTrendingProducts(trendingData);
        } else {
          console.warn('Failed to fetch trending products', trendingData.error);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStorefrontAndProducts();
  }, []);

  const handleProductChange = (index: number, field: keyof ProductInput, value: string | File | null) => {
    const newProducts = [...products];
    if (field === 'imageFile' && value instanceof File) {
      newProducts[index].imageFile = value;
      newProducts[index].imageUrl = URL.createObjectURL(value); // For preview
    } else if (typeof value === 'string') {
      (newProducts[index] as any)[field] = value;
    }
    setProducts(newProducts);
  };

  const addProduct = () => {
    if (products.length < 10) {
      setProducts([...products, { id: `new-${products.length}`, name: '', description: '', imageFile: null, imageUrl: '' }]);
    }
  };

  const removeProduct = (index: number) => {
    if (products.length > 4) {
      const newProducts = products.filter((_, i) => i !== index);
      setProducts(newProducts);
    } else {
      alert('You must have at least 4 products.');
    }
  };

  const addTrendingProduct = (trendingProduct: StorefrontProduct) => {
    if (products.length < 10) {
      setProducts([...products, {
        id: trendingProduct.product_id,
        name: trendingProduct.product_name,
        description: trendingProduct.product_description,
        imageFile: null,
        imageUrl: trendingProduct.product_image_url,
        isTrending: true,
      }]);
    } else {
      alert('You cannot add more than 10 products.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!storefrontId) {
      setError('Storefront ID is missing.');
      setLoading(false);
      return;
    }

    try {
      const productsToSave = await Promise.all(
        products.map(async (product) => {
          let product_image_url = product.imageUrl;
          if (product.imageFile) {
            const fileExt = product.imageFile.name.split('.').pop();
            const fileName = `${storefrontId}-${product.id}.${fileExt}`;
            const { data, error: uploadError } = await supabase.storage
              .from('product-images')
              .upload(fileName, product.imageFile, {
                cacheControl: '3600',
                upsert: true,
              });

            if (uploadError) throw uploadError;
            product_image_url = data.path;
          }
          return {
            product_id: product.id.startsWith('new-') ? undefined : product.id, // Only send ID if existing
            product_name: product.name,
            product_description: product.description,
            product_image_url: product_image_url,
            display_order: products.indexOf(product), // Simple ordering for now
            is_trending: product.isTrending || false,
          };
        })
      );

      const response = await fetch(`/api/storefronts/${storefrontId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: productsToSave }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save products');
      }

      alert('Products updated successfully!');
      navigate('/business-storefront'); // Navigate back to storefront view
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading products...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Storefront Products</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {!storefrontId && (
          <div className="text-center text-red-500 mb-4">
            Please create your <button onClick={() => navigate('/edit-business-storefront')} className="text-blue-500 underline">storefront</button> first.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {products.map((product, index) => (
            <div key={product.id} className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50 relative">
              <h3 className="text-lg font-semibold mb-3">Product {index + 1}</h3>
              <div className="mb-4">
                <label htmlFor={`productName-${index}`} className="block text-gray-700 text-sm font-bold mb-2">
                  Product Name:
                </label>
                <input
                  type="text"
                  id={`productName-${index}`}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={product.name}
                  onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor={`productDescription-${index}`} className="block text-gray-700 text-sm font-bold mb-2">
                  Description:
                </label>
                <textarea
                  id={`productDescription-${index}`}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={product.description}
                  onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                  rows={3}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor={`productImage-${index}`} className="block text-gray-700 text-sm font-bold mb-2">
                  Product Image:
                </label>
                <input
                  type="file"
                  id={`productImage-${index}`}
                  accept="image/*"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => handleProductChange(index, 'imageFile', e.target.files ? e.target.files[0] : null)}
                />
                {product.imageUrl && (
                  <img src={`${supabase.storage.from('product-images').getPublicUrl(product.imageUrl).data.publicUrl}`} alt="Product Preview" className="mt-2 w-24 h-24 object-cover rounded" />
                )}
              </div>
              {products.length > 4 && (
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full text-xs"
                >
                  X
                </button>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={addProduct}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={products.length >= 10}
            >
              Add Product
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading || products.length < 4 || products.length > 10 || !storefrontId || products.some(p => !p.name || !p.description || !p.imageUrl)}
            >
              {loading ? 'Saving...' : 'Save Products'}
            </button>
          </div>
        </form>

        {trendingProducts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-center">Trending Product Suggestions</h3>
            <div className="grid grid-cols-2 gap-4">
              {trendingProducts.map((trendProduct) => (
                <div key={trendProduct.product_id} className="border rounded-lg p-3 text-center bg-blue-50">
                  {trendProduct.product_image_url && (
                    <img
                      src={`${supabase.storage.from('product-images').getPublicUrl(trendProduct.product_image_url).data.publicUrl}`}
                      alt={trendProduct.product_name}
                      className="w-full h-24 object-cover mb-2 rounded"
                    />
                  )}
                  <p className="font-semibold text-sm">{trendProduct.product_name}</p>
                  <p className="text-gray-600 text-xs line-clamp-2">{trendProduct.product_description}</p>
                  <button
                    onClick={() => addTrendingProduct(trendProduct)}
                    className="mt-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded text-xs"
                    disabled={products.length >= 10 || products.some(p => p.id === trendProduct.product_id)}
                  >
                    Add to Storefront
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BusinessStorefrontProducts;
