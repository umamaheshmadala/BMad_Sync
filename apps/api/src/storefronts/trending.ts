import { serve } from '@deno/http';
import { createClient } from '@supabase/supabase-js';
import { StorefrontProduct } from '../../../../packages/shared-types/src';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === 'GET' && path === '/api/trending-products') {
      // Mock trending products for now
      const trendingProducts: StorefrontProduct[] = [
        {
          product_id: 'trend-1',
          storefront_id: '', // Placeholder, not relevant for trending list
          product_name: 'Trending Product A',
          product_description: 'This is a very popular product.',
          product_image_url: '',
          display_order: 0,
          is_trending: true,
        },
        {
          product_id: 'trend-2',
          storefront_id: '',
          product_name: 'Trending Product B',
          product_description: 'Another highly sought-after item.',
          product_image_url: '',
          display_order: 1,
          is_trending: true,
        },
      ];

      return new Response(JSON.stringify(trendingProducts), {
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
