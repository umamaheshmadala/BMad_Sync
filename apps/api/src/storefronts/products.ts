import { serve } from '@deno/http';
import { createClient } from '@supabase/supabase-js';
import { StorefrontProduct } from '../../../../packages/shared-types/src';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');

    if (req.method === 'POST' && pathParts[3] === 'products') {
      const storefront_id = pathParts[2];
      const { products } = await req.json();

      if (!storefront_id) {
        return new Response(JSON.stringify({ error: 'Storefront ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Delete existing products for this storefront to handle updates/removals
      const { error: deleteError } = await supabase
        .from('StorefrontProducts')
        .delete()
        .eq('storefront_id', storefront_id);

      if (deleteError) throw deleteError;

      // Insert new/updated products
      const productsToInsert = products.map((product: StorefrontProduct) => ({
        storefront_id,
        product_name: product.product_name,
        product_description: product.product_description,
        product_image_url: product.product_image_url,
        display_order: product.display_order,
        is_trending: product.is_trending || false, // Default to false if not provided
      }));

      const { data, error } = await supabase
        .from('StorefrontProducts')
        .upsert(productsToInsert as StorefrontProduct[]);

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (req.method === 'GET' && pathParts[3] === 'products') {
      const storefront_id = pathParts[2];

      if (!storefront_id) {
        return new Response(JSON.stringify({ error: 'Storefront ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabase
        .from('StorefrontProducts')
        .select('*')
        .eq('storefront_id', storefront_id)
        .order('display_order', { ascending: true });

      if (error) throw error;
      if (!data) {
        return new Response(JSON.stringify({ message: 'No products found for this storefront' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
